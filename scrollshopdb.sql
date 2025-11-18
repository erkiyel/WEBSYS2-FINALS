-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 18, 2025 at 03:55 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `scrollshopdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `elements`
--

CREATE TABLE `elements` (
  `element_id` int(11) NOT NULL,
  `element_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `elements`
--

INSERT INTO `elements` (`element_id`, `element_name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Fire', 'The element of flames, heat, and destruction. Fire spells are known for their raw damage output.', '2025-11-18 02:27:38', '2025-11-18 02:27:38'),
(2, 'Water', 'The element of flow, healing, and adaptability. Water spells can heal allies or overwhelm enemies.', '2025-11-18 02:27:38', '2025-11-18 02:27:38'),
(3, 'Earth', 'The element of strength, stability, and defense. Earth spells provide protection and durability.', '2025-11-18 02:27:38', '2025-11-18 02:27:38'),
(4, 'Air', 'The element of speed, freedom, and precision. Air spells are swift and hard to dodge.', '2025-11-18 02:27:38', '2025-11-18 02:27:38'),
(5, 'Lightning', 'The element of electricity and storms. Lightning spells strike with incredible speed and power.', '2025-11-18 02:27:38', '2025-11-18 02:27:38'),
(6, 'Ice', 'The element of cold and control. Ice spells can freeze enemies and slow their movements.', '2025-11-18 02:27:38', '2025-11-18 02:27:38'),
(7, 'Nature', 'The element of life and growth. Nature spells harness the power of plants and animals.', '2025-11-18 02:27:38', '2025-11-18 02:27:38'),
(8, 'Shadow', 'The element of darkness and stealth. Shadow spells are perfect for deception and ambush.', '2025-11-18 02:27:38', '2025-11-18 02:27:38');

-- --------------------------------------------------------

--
-- Table structure for table `orderitems`
--

CREATE TABLE `orderitems` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `shop_inventory_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderitems`
--

INSERT INTO `orderitems` (`order_item_id`, `order_id`, `shop_inventory_id`, `quantity`, `unit_price`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 2, 150.00, '2025-11-18 02:45:57', '2025-11-18 02:45:57'),
(2, 1, 2, 1, 135.00, '2025-11-18 02:45:57', '2025-11-18 02:45:57'),
(3, 2, 5, 2, 300.00, '2025-11-18 02:45:57', '2025-11-18 02:45:57'),
(4, 3, 7, 1, 1200.00, '2025-11-18 02:45:57', '2025-11-18 02:45:57'),
(5, 4, 6, 1, 270.00, '2025-11-18 02:45:57', '2025-11-18 02:45:57');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_date` datetime DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('Pending','Completed','Cancelled') DEFAULT 'Pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `customer_id`, `order_date`, `total_amount`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 6, '2025-01-20 02:30:00', 450.00, 'Completed', '2025-11-18 02:45:17', '2025-11-18 02:45:17'),
(2, 7, '2025-01-21 06:15:00', 600.00, 'Completed', '2025-11-18 02:45:17', '2025-11-18 02:45:17'),
(3, 8, '2025-01-22 01:00:00', 1200.00, 'Pending', '2025-11-18 02:45:17', '2025-11-18 02:45:17'),
(4, 6, '2025-01-23 08:45:00', 270.00, 'Completed', '2025-11-18 02:45:17', '2025-11-18 02:45:17');

-- --------------------------------------------------------

--
-- Table structure for table `scrollelements`
--

CREATE TABLE `scrollelements` (
  `scroll_id` int(11) NOT NULL,
  `element_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scrollelements`
--

INSERT INTO `scrollelements` (`scroll_id`, `element_id`, `createdAt`, `updatedAt`) VALUES
(1, 1, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(2, 2, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(3, 3, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(4, 4, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(5, 5, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(6, 6, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(7, 1, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(7, 3, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(8, 2, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(9, 8, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(10, 7, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(11, 1, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(12, 2, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(12, 6, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(13, 4, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(13, 5, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(14, 1, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(14, 2, '2025-11-18 02:29:11', '2025-11-18 02:29:11'),
(15, 3, '2025-11-18 02:29:11', '2025-11-18 02:29:11');

-- --------------------------------------------------------

--
-- Table structure for table `scrolls`
--

CREATE TABLE `scrolls` (
  `scroll_id` int(11) NOT NULL,
  `scroll_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `base_power` int(11) NOT NULL,
  `rarity` enum('Common','Uncommon','Rare','Epic','Legendary') NOT NULL DEFAULT 'Common',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scrolls`
--

INSERT INTO `scrolls` (`scroll_id`, `scroll_name`, `description`, `base_power`, `rarity`, `createdAt`, `updatedAt`) VALUES
(1, 'Fireball', 'Launch a blazing sphere of fire at your enemies.', 80, 'Common', '2025-11-18 02:28:21', '2025-11-18 02:28:21'),
(2, 'Healing Wave', 'Restore health to yourself or an ally with soothing water magic.', 60, 'Common', '2025-11-18 02:28:21', '2025-11-18 02:28:21'),
(3, 'Stone Shield', 'Summon a protective barrier of solid rock.', 50, 'Uncommon', '2025-11-18 02:28:21', '2025-11-18 02:28:21'),
(4, 'Wind Slash', 'Cut through enemies with a razor-sharp gust of wind.', 70, 'Common', '2025-11-18 02:28:21', '2025-11-18 02:28:21'),
(5, 'Lightning Bolt', 'Strike down foes with a bolt of pure electricity.', 90, 'Rare', '2025-11-18 02:28:21', '2025-11-18 02:28:21'),
(6, 'Ice Lance', 'Pierce enemies with a sharp spear of ice.', 75, 'Uncommon', '2025-11-18 02:28:21', '2025-11-18 02:28:21'),
(7, 'Meteor Strike', 'Call down a flaming meteor from the sky.', 150, 'Epic', '2025-11-18 02:28:21', '2025-11-18 02:28:21'),
(8, 'Tsunami', 'Summon a massive wave to sweep away all opposition.', 140, 'Epic', '2025-11-18 02:28:21', '2025-11-18 02:28:21'),
(9, 'Shadow Step', 'Teleport through shadows to escape danger.', 30, 'Rare', '2025-11-18 02:28:21', '2025-11-18 02:28:21'),
(10, 'Vine Entangle', 'Trap enemies in writhing magical vines.', 55, 'Uncommon', '2025-11-18 02:28:21', '2025-11-18 02:28:21'),
(11, 'Inferno', 'Create a raging firestorm that engulfs the battlefield.', 200, 'Legendary', '2025-11-18 02:28:21', '2025-11-18 02:28:21'),
(12, 'Glacial Fortress', 'Encase yourself in an impenetrable wall of ice.', 100, 'Rare', '2025-11-18 02:28:21', '2025-11-18 02:28:21'),
(13, 'Thunderstorm', 'Call down multiple lightning strikes across the area.', 180, 'Epic', '2025-11-18 02:28:21', '2025-11-18 02:28:21'),
(14, 'Steam Blast', 'Combine fire and water to create a scalding steam explosion.', 95, 'Rare', '2025-11-18 02:28:21', '2025-11-18 02:28:21'),
(15, 'Earthquake', 'Shake the ground and topple your enemies.', 120, 'Epic', '2025-11-18 02:28:21', '2025-11-18 02:28:21');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20251118005207-create-user.js'),
('20251118005245-create-element.js'),
('20251118005255-create-scroll.js'),
('20251118005308-create-specialist.js'),
('20251118005322-create-specialist-inventory.js'),
('20251118005335-create-shop-inventory.js'),
('20251118005347-create-order.js'),
('20251118005357-create-order-item.js'),
('20251118014453-create-scroll-element.js');

-- --------------------------------------------------------

--
-- Table structure for table `shopinventories`
--

CREATE TABLE `shopinventories` (
  `shop_inventory_id` int(11) NOT NULL,
  `scroll_id` int(11) NOT NULL,
  `specialist_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `purchase_price` decimal(10,2) NOT NULL,
  `selling_price` decimal(10,2) NOT NULL,
  `quality_rating` decimal(3,2) NOT NULL,
  `acquired_date` datetime DEFAULT current_timestamp(),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shopinventories`
--

INSERT INTO `shopinventories` (`shop_inventory_id`, `scroll_id`, `specialist_id`, `quantity`, `purchase_price`, `selling_price`, `quality_rating`, `acquired_date`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 20, 100.00, 150.00, 9.50, '2025-01-15 00:00:00', '2025-11-18 02:45:29', '2025-11-18 02:45:29'),
(2, 2, 2, 25, 90.00, 135.00, 9.20, '2025-01-15 00:00:00', '2025-11-18 02:45:29', '2025-11-18 02:45:29'),
(3, 3, 3, 18, 110.00, 165.00, 8.80, '2025-01-15 00:00:00', '2025-11-18 02:45:29', '2025-11-18 02:45:29'),
(4, 4, 4, 22, 95.00, 145.00, 9.00, '2025-01-15 00:00:00', '2025-11-18 02:45:29', '2025-11-18 02:45:29'),
(5, 5, 4, 15, 200.00, 300.00, 8.80, '2025-01-16 00:00:00', '2025-11-18 02:45:29', '2025-11-18 02:45:29'),
(6, 6, 2, 20, 180.00, 270.00, 9.00, '2025-01-16 00:00:00', '2025-11-18 02:45:29', '2025-11-18 02:45:29'),
(7, 7, 1, 5, 800.00, 1200.00, 9.80, '2025-01-17 00:00:00', '2025-11-18 02:45:29', '2025-11-18 02:45:29'),
(8, 8, 2, 4, 750.00, 1100.00, 9.50, '2025-01-17 00:00:00', '2025-11-18 02:45:29', '2025-11-18 02:45:29');

-- --------------------------------------------------------

--
-- Table structure for table `specialistinventories`
--

CREATE TABLE `specialistinventories` (
  `inventory_id` int(11) NOT NULL,
  `specialist_id` int(11) NOT NULL,
  `scroll_id` int(11) NOT NULL,
  `stock_quantity` int(11) NOT NULL DEFAULT 0,
  `source_price` decimal(10,2) NOT NULL,
  `quality_rating` decimal(3,2) NOT NULL,
  `is_specialty` tinyint(1) DEFAULT 0,
  `last_updated` datetime DEFAULT current_timestamp(),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `specialistinventories`
--

INSERT INTO `specialistinventories` (`inventory_id`, `specialist_id`, `scroll_id`, `stock_quantity`, `source_price`, `quality_rating`, `is_specialty`, `last_updated`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 50, 100.00, 9.50, 1, '2025-01-10 00:00:00', '2025-11-18 02:45:36', '2025-11-18 02:45:36'),
(2, 1, 7, 15, 800.00, 9.80, 1, '2025-01-10 00:00:00', '2025-11-18 02:45:36', '2025-11-18 02:45:36'),
(3, 1, 11, 5, 2000.00, 9.99, 1, '2025-01-10 00:00:00', '2025-11-18 02:45:36', '2025-11-18 02:45:36'),
(4, 1, 6, 10, 150.00, 6.00, 0, '2025-01-10 00:00:00', '2025-11-18 02:45:36', '2025-11-18 02:45:36'),
(5, 2, 2, 60, 90.00, 9.20, 1, '2025-01-10 00:00:00', '2025-11-18 02:45:36', '2025-11-18 02:45:36'),
(6, 2, 8, 12, 750.00, 9.50, 1, '2025-01-10 00:00:00', '2025-11-18 02:45:36', '2025-11-18 02:45:36'),
(7, 2, 6, 40, 180.00, 9.00, 1, '2025-01-10 00:00:00', '2025-11-18 02:45:36', '2025-11-18 02:45:36'),
(8, 2, 1, 15, 70.00, 6.50, 0, '2025-01-10 00:00:00', '2025-11-18 02:45:36', '2025-11-18 02:45:36'),
(9, 3, 3, 55, 110.00, 8.80, 1, '2025-01-10 00:00:00', '2025-11-18 02:45:36', '2025-11-18 02:45:36'),
(10, 3, 15, 20, 700.00, 9.00, 1, '2025-01-10 00:00:00', '2025-11-18 02:45:36', '2025-11-18 02:45:36'),
(11, 3, 7, 8, 750.00, 8.50, 1, '2025-01-10 00:00:00', '2025-11-18 02:45:36', '2025-11-18 02:45:36'),
(12, 4, 4, 45, 95.00, 9.00, 1, '2025-01-10 00:00:00', '2025-11-18 02:45:36', '2025-11-18 02:45:36'),
(13, 4, 5, 30, 200.00, 8.80, 1, '2025-01-10 00:00:00', '2025-11-18 02:45:36', '2025-11-18 02:45:36'),
(14, 4, 13, 10, 900.00, 9.20, 1, '2025-01-10 00:00:00', '2025-11-18 02:45:36', '2025-11-18 02:45:36');

-- --------------------------------------------------------

--
-- Table structure for table `specialists`
--

CREATE TABLE `specialists` (
  `specialist_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `shop_name` varchar(255) NOT NULL,
  `specialty_element_id` int(11) NOT NULL,
  `reputation_rating` decimal(3,2) DEFAULT 5.00,
  `contact_info` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `specialists`
--

INSERT INTO `specialists` (`specialist_id`, `user_id`, `shop_name`, `specialty_element_id`, `reputation_rating`, `contact_info`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'Pyra\'s Flame Emporium', 1, 9.50, 'pyra@firemage.com | Tower District', '2025-11-18 02:44:54', '2025-11-18 02:44:54'),
(2, 3, 'Aquos\' Aquatic Arsenal', 2, 9.20, 'aquos@watermage.com | Harbor Quarter', '2025-11-18 02:44:54', '2025-11-18 02:44:54'),
(3, 4, 'Terra\'s Stone Sanctuary', 3, 8.80, 'terra@earthmage.com | Mountain Base', '2025-11-18 02:44:54', '2025-11-18 02:44:54'),
(4, 5, 'Zephyr\'s Sky Shop', 4, 9.00, 'zephyr@airmage.com | Cloud District', '2025-11-18 02:44:54', '2025-11-18 02:44:54');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('Customer','Specialist','Seller') NOT NULL DEFAULT 'Customer',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `role`, `created_at`, `createdAt`, `updatedAt`) VALUES
(1, 'admin_seller', 'seller@magicshop.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Seller', '2025-01-01 00:00:00', '2025-11-18 02:44:03', '2025-11-18 02:44:03'),
(2, 'pyra_fire', 'pyra@firemage.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Specialist', '2025-01-02 00:00:00', '2025-11-18 02:44:03', '2025-11-18 02:44:03'),
(3, 'aquos_water', 'aquos@watermage.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Specialist', '2025-01-02 00:00:00', '2025-11-18 02:44:03', '2025-11-18 02:44:03'),
(4, 'terra_earth', 'terra@earthmage.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Specialist', '2025-01-02 00:00:00', '2025-11-18 02:44:03', '2025-11-18 02:44:03'),
(5, 'zephyr_air', 'zephyr@airmage.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Specialist', '2025-01-02 00:00:00', '2025-11-18 02:44:03', '2025-11-18 02:44:03'),
(6, 'alice_customer', 'alice@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Customer', '2025-01-05 00:00:00', '2025-11-18 02:44:03', '2025-11-18 02:44:03'),
(7, 'bob_customer', 'bob@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Customer', '2025-01-05 00:00:00', '2025-11-18 02:44:03', '2025-11-18 02:44:03'),
(8, 'charlie_customer', 'charlie@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Customer', '2025-01-06 00:00:00', '2025-11-18 02:44:03', '2025-11-18 02:44:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `elements`
--
ALTER TABLE `elements`
  ADD PRIMARY KEY (`element_id`),
  ADD UNIQUE KEY `element_name` (`element_name`);

--
-- Indexes for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `shop_inventory_id` (`shop_inventory_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `scrollelements`
--
ALTER TABLE `scrollelements`
  ADD PRIMARY KEY (`scroll_id`,`element_id`),
  ADD KEY `scroll_elements_element_id` (`element_id`);

--
-- Indexes for table `scrolls`
--
ALTER TABLE `scrolls`
  ADD PRIMARY KEY (`scroll_id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `shopinventories`
--
ALTER TABLE `shopinventories`
  ADD PRIMARY KEY (`shop_inventory_id`),
  ADD KEY `scroll_id` (`scroll_id`),
  ADD KEY `specialist_id` (`specialist_id`);

--
-- Indexes for table `specialistinventories`
--
ALTER TABLE `specialistinventories`
  ADD PRIMARY KEY (`inventory_id`),
  ADD UNIQUE KEY `specialist_scroll_unique` (`specialist_id`,`scroll_id`),
  ADD KEY `scroll_id` (`scroll_id`);

--
-- Indexes for table `specialists`
--
ALTER TABLE `specialists`
  ADD PRIMARY KEY (`specialist_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `specialty_element_id` (`specialty_element_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `elements`
--
ALTER TABLE `elements`
  MODIFY `element_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `scrolls`
--
ALTER TABLE `scrolls`
  MODIFY `scroll_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `shopinventories`
--
ALTER TABLE `shopinventories`
  MODIFY `shop_inventory_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `specialistinventories`
--
ALTER TABLE `specialistinventories`
  MODIFY `inventory_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `specialists`
--
ALTER TABLE `specialists`
  MODIFY `specialist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`shop_inventory_id`) REFERENCES `shopinventories` (`shop_inventory_id`) ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE;

--
-- Constraints for table `scrollelements`
--
ALTER TABLE `scrollelements`
  ADD CONSTRAINT `scrollelements_ibfk_1` FOREIGN KEY (`scroll_id`) REFERENCES `scrolls` (`scroll_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `scrollelements_ibfk_2` FOREIGN KEY (`element_id`) REFERENCES `elements` (`element_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `shopinventories`
--
ALTER TABLE `shopinventories`
  ADD CONSTRAINT `shopinventories_ibfk_1` FOREIGN KEY (`scroll_id`) REFERENCES `scrolls` (`scroll_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `shopinventories_ibfk_2` FOREIGN KEY (`specialist_id`) REFERENCES `specialists` (`specialist_id`) ON UPDATE CASCADE;

--
-- Constraints for table `specialistinventories`
--
ALTER TABLE `specialistinventories`
  ADD CONSTRAINT `specialistinventories_ibfk_1` FOREIGN KEY (`specialist_id`) REFERENCES `specialists` (`specialist_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `specialistinventories_ibfk_2` FOREIGN KEY (`scroll_id`) REFERENCES `scrolls` (`scroll_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `specialists`
--
ALTER TABLE `specialists`
  ADD CONSTRAINT `specialists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `specialists_ibfk_2` FOREIGN KEY (`specialty_element_id`) REFERENCES `elements` (`element_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
