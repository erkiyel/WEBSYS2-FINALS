jest.mock('../../middleware/auth', () => ({
  isAuthenticated: (req, res, next) => {
    const headerId = req.headers['x-test-user-id'];
    req.user = { user_id: headerId ? Number(headerId) : 1 };
    return next();
  }
}));

const request = require('supertest');

const mockUser = {
  user_id: 1,
  username: 'alice',
  email: 'alice@example.com',
  role: 'Customer',
  created_at: '2025-11-01'
};

const mockSpecialistUser = {
  user_id: 2,
  username: 'bob',
  email: 'bob@example.com',
  role: 'Specialist',
  created_at: '2025-11-02',
  toJSON() {
    return {
      user_id: this.user_id,
      username: this.username,
      email: this.email,
      role: this.role,
      created_at: this.created_at
    };
  }
};

const mockSpecialist = {
  specialist_id: 10,
  user_id: 2,
  specialtyElement: { element_id: 5, name: 'Fire' }
};

jest.mock('../../models', () => ({
  User: {
    findByPk: jest.fn(),
    findOne: jest.fn()
  },
  Specialist: {
    findOne: jest.fn()
  },
  Element: {},
  Sequelize: {
    Op: {
      ne: 'NE'
    }
  }
}));

const dbMock = require('../../models');

let app;

beforeAll(() => {
  // require app after mocks are in place
  app = require('../../server');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/users/profile', () => {
  test('returns user profile when found (non-specialist)', async () => {
    dbMock.User.findByPk.mockResolvedValue(mockUser);

    const res = await request(app).get('/api/users/profile');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockUser);
    expect(dbMock.User.findByPk).toHaveBeenCalledWith(1, {
      attributes: ['user_id', 'username', 'email', 'role', 'created_at']
    });
  });

  test('returns specialist profile with specialist data when role is Specialist', async () => {
    // ensure middleware sets req.user.user_id=2 for this scenario
    dbMock.User.findByPk.mockResolvedValue(mockSpecialistUser);
    dbMock.Specialist.findOne.mockResolvedValue(mockSpecialist);

    const res = await request(app).get('/api/users/profile').set('x-test-user-id', '2');

    expect(res.status).toBe(200);
    // should include specialist field
    expect(res.body.specialist).toEqual(mockSpecialist);
    expect(dbMock.User.findByPk).toHaveBeenCalledWith(2, {
      attributes: ['user_id', 'username', 'email', 'role', 'created_at']
    });
    expect(dbMock.Specialist.findOne).toHaveBeenCalled();
  });

  test('returns 404 when user not found', async () => {
    dbMock.User.findByPk.mockResolvedValue(null);

    const res = await request(app).get('/api/users/profile');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'User not found' });
  });
});

describe('PUT /api/users/profile', () => {
  test('updates email successfully', async () => {
    const userInstance = {
      user_id: 1,
      username: 'alice',
      email: 'alice@example.com',
      role: 'Customer',
      save: jest.fn().mockResolvedValue(true)
    };

    dbMock.User.findByPk.mockResolvedValue(userInstance);
    dbMock.User.findOne.mockResolvedValue(null); // no existing email

    const res = await request(app)
      .put('/api/users/profile')
      .send({ email: 'new@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Profile updated successfully');
    expect(res.body.user).toMatchObject({ username: 'alice', email: 'new@example.com' });
    expect(userInstance.save).toHaveBeenCalled();
  });

  test('returns 400 when email already in use', async () => {
    const userInstance = { user_id: 1, save: jest.fn() };
    dbMock.User.findByPk.mockResolvedValue(userInstance);
    dbMock.User.findOne.mockResolvedValue({ user_id: 99 });

    const res = await request(app)
      .put('/api/users/profile')
      .send({ email: 'taken@example.com' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Email already in use' });
    expect(userInstance.save).not.toHaveBeenCalled();
  });

  test('returns 404 when user to update not found', async () => {
    dbMock.User.findByPk.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/users/profile')
      .send({ email: 'whatever@example.com' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'User not found' });
  });
});
