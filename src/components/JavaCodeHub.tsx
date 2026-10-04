import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  FolderTree,
  FileCode,
  Database,
  Server,
  Layout,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface CodeFile {
  id: string;
  name: string;
  category: 'sql' | 'backend' | 'frontend' | 'config';
  language: 'sql' | 'java' | 'xml' | 'properties' | 'html';
  description: string;
  path: string;
  code: string;
}

export const JAVA_PROJECT_FILES: CodeFile[] = [
  {
    id: 'sql-schema',
    name: 'schema_bookmyshow.sql',
    category: 'sql',
    language: 'sql',
    description: 'Complete MySQL Relational Database Schema for BookMyShow architecture with cities, theatres, shows, tiered seats, bookings, and payments.',
    path: 'src/main/resources/schema.sql',
    code: `-- ========================================================================
-- BOOKMYSHOW RELATIONAL DATABASE SCHEMA (MySQL 8.0+)
-- ========================================================================
CREATE DATABASE IF NOT EXISTS bookmyshow_db;
USE bookmyshow_db;

-- 1. Cities
CREATE TABLE cities (
    city_id INT PRIMARY KEY AUTO_INCREMENT,
    city_name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Theatres / Multiplexes (PVR, INOX, Cinepolis)
CREATE TABLE theatres (
    theatre_id INT PRIMARY KEY AUTO_INCREMENT,
    theatre_name VARCHAR(150) NOT NULL,
    city_id INT NOT NULL,
    address VARCHAR(255),
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE CASCADE
);

-- 3. Screens / Auditoriums
CREATE TABLE screens (
    screen_id INT PRIMARY KEY AUTO_INCREMENT,
    theatre_id INT NOT NULL,
    screen_name VARCHAR(50) NOT NULL,
    sound_type VARCHAR(50) DEFAULT 'Dolby Atmos 7.1',
    FOREIGN KEY (theatre_id) REFERENCES theatres(theatre_id) ON DELETE CASCADE
);

-- 4. Movies
CREATE TABLE movies (
    movie_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    duration_mins INT NOT NULL,
    language VARCHAR(50) NOT NULL,
    genre VARCHAR(100),
    rating VARCHAR(20),
    poster_url VARCHAR(500)
);

-- 5. Movie Shows / Showtimes
CREATE TABLE shows (
    show_id INT PRIMARY KEY AUTO_INCREMENT,
    movie_id INT NOT NULL,
    screen_id INT NOT NULL,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY (screen_id) REFERENCES screens(screen_id)
);

-- 6. Physical Seats in Screen
CREATE TABLE seats (
    seat_id INT PRIMARY KEY AUTO_INCREMENT,
    screen_id INT NOT NULL,
    seat_row CHAR(1) NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    seat_type ENUM('RECLINER', 'PRIME', 'CLASSIC') DEFAULT 'CLASSIC',
    FOREIGN KEY (screen_id) REFERENCES screens(screen_id) ON DELETE CASCADE,
    UNIQUE KEY uq_screen_seat (screen_id, seat_row, seat_number)
);

-- 7. Show-Seat Inventory (Status per Show)
CREATE TABLE show_seats (
    show_seat_id INT PRIMARY KEY AUTO_INCREMENT,
    show_id INT NOT NULL,
    seat_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status ENUM('AVAILABLE', 'LOCKED', 'BOOKED') DEFAULT 'AVAILABLE',
    version INT DEFAULT 0, -- For Optimistic Concurrency Locking
    FOREIGN KEY (show_id) REFERENCES shows(show_id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id) ON DELETE CASCADE,
    UNIQUE KEY uq_show_seat (show_id, seat_id)
);

-- 8. Bookings
CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_reference VARCHAR(50) NOT NULL UNIQUE,
    show_id INT NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(150),
    customer_phone VARCHAR(20),
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status ENUM('CONFIRMED', 'CANCELLED', 'PENDING') DEFAULT 'CONFIRMED',
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (show_id) REFERENCES shows(show_id)
);

-- 9. Booking Seats Mapping (Enables Multiple Seats per Booking like BookMyShow)
CREATE TABLE booking_seats (
    booking_seat_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    show_seat_id INT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (show_seat_id) REFERENCES show_seats(show_seat_id)
);

-- 10. Payments
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    payment_method ENUM('UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'CASH') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('SUCCESS', 'FAILED', 'REFUNDED') DEFAULT 'SUCCESS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

-- Sample Initial Data
INSERT INTO cities (city_name) VALUES ('Mumbai'), ('Bengaluru'), ('Chennai');
INSERT INTO theatres (theatre_name, city_id, address) VALUES 
('PVR Cinemas ICON', 1, 'Lower Parel, Mumbai'),
('INOX Megaplex', 1, 'Malad, Mumbai');

INSERT INTO screens (theatre_id, screen_name, sound_type) VALUES 
(1, 'Audi 1 (IMAX Laser)', 'IMAX 12-Channel'),
(1, 'Audi 2 (Dolby Atmos)', 'Dolby Atmos 7.1');

INSERT INTO movies (title, duration_mins, language, genre, rating) VALUES 
('Interstellar', 169, 'English', 'Sci-Fi / Adventure', 'U/A'),
('Avengers Endgame', 181, 'English', 'Action / Epic', 'U/A'),
('Leo', 164, 'Tamil', 'Action / Thriller', 'U/A');

INSERT INTO shows (movie_id, screen_id, show_date, show_time) VALUES
(1, 1, CURDATE(), '10:30:00'),
(1, 1, CURDATE(), '14:15:00'),
(1, 1, CURDATE(), '18:45:00'),
(2, 2, CURDATE(), '13:00:00'),
(3, 1, CURDATE(), '21:30:00');`,
  },
  {
    id: 'pom-xml',
    name: 'pom.xml',
    category: 'config',
    language: 'xml',
    description: 'Maven build file configured with Spring Boot 3.2, Spring Data JPA, Spring Web, MySQL Connector, and Thymeleaf.',
    path: 'pom.xml',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.4</version>
        <relativePath/>
    </parent>
    <groupId>com.bookmyshow</groupId>
    <artifactId>movie-ticket-booking</artifactId>
    <version>1.0.0</version>
    <name>BookMyShow Movie Ticket Booking System</name>
    <description>Enterprise Movie Ticket Booking Backend & Frontend in Java Spring Boot</description>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web (REST API & MVC) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA & Hibernate ORM -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- MySQL Database Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Thymeleaf Template Engine (for Java-rendered Frontend) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>

        <!-- Validation (Bean Validation) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Lombok (reduces boilerplate getters/setters/constructors) -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`,
  },
  {
    id: 'app-properties',
    name: 'application.properties',
    category: 'config',
    language: 'properties',
    description: 'Spring Boot configuration connecting to MySQL with HikariCP connection pool and JPA Hibernate settings.',
    path: 'src/main/resources/application.properties',
    code: `# Server Port
server.port=8080

# Database Configuration (MySQL)
spring.datasource.url=jdbc:mysql://localhost:3306/bookmyshow_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Connection Pool (HikariCP)
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=30000

# JPA / Hibernate Properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Thymeleaf Template Engine Settings
spring.thymeleaf.cache=false
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html`,
  },
  {
    id: 'booking-service',
    name: 'BookingService.java',
    category: 'backend',
    language: 'java',
    description: 'Core Business Service handling race conditions, multi-seat locking, price computation, payment processing, and atomic ACID transaction commit.',
    path: 'src/main/java/com/bookmyshow/service/BookingService.java',
    code: `package com.bookmyshow.service;

import com.bookmyshow.dto.BookingRequestDto;
import com.bookmyshow.dto.BookingResponseDto;
import com.bookmyshow.entity.*;
import com.bookmyshow.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private ShowSeatRepository showSeatRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * ATOMIC MULTI-SEAT BOOKING TRANSACTION
     * Uses database-level row locking (@Transactional + SELECT FOR UPDATE)
     * to prevent two users from booking the same seat simultaneously (Race Condition).
     */
    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto request) {
        // 1. Fetch and Validate Show
        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Show ID: " + request.getShowId()));

        // 2. Fetch Selected Seats with PESSIMISTIC LOCK (SELECT ... FOR UPDATE)
        List<ShowSeat> selectedSeats = showSeatRepository.findByShowIdAndSeatIdsForUpdate(
                request.getShowId(),
                request.getSelectedSeatIds()
        );

        if (selectedSeats.size() != request.getSelectedSeatIds().size()) {
            throw new IllegalStateException("One or more selected seats do not exist for this show.");
        }

        // 3. Verify All Selected Seats are AVAILABLE
        for (ShowSeat seat : selectedSeats) {
            if (seat.getStatus() != SeatStatus.AVAILABLE) {
                throw new IllegalStateException("Seat " + seat.getSeat().getSeatNumber() 
                        + " is already " + seat.getStatus() + ". Please select another seat.");
            }
        }

        // 4. Calculate Total Amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (ShowSeat seat : selectedSeats) {
            totalAmount = totalAmount.add(seat.getPrice());
        }

        // 5. Create Booking Entity
        String bookingRef = "BMS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Booking booking = new Booking();
        booking.setBookingReference(bookingRef);
        booking.setShow(show);
        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setCustomerPhone(request.getCustomerPhone());
        booking.setTotalAmount(totalAmount);
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        booking.setBookingTime(LocalDateTime.now());

        // 6. Associate Seats with Booking & Mark as BOOKED
        List<BookingSeat> bookingSeats = new ArrayList<>();
        for (ShowSeat seat : selectedSeats) {
            seat.setStatus(SeatStatus.BOOKED); // Atomic status change
            showSeatRepository.save(seat);

            BookingSeat bs = new BookingSeat();
            bs.setBooking(booking);
            bs.setShowSeat(seat);
            bookingSeats.add(bs);
        }
        booking.setBookingSeats(bookingSeats);

        // 7. Save Booking (Generates primary key)
        Booking savedBooking = bookingRepository.save(booking);

        // 8. Process & Record Payment
        Payment payment = new Payment();
        payment.setBooking(savedBooking);
        payment.setTransactionId("TXN-" + System.currentTimeMillis());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setAmount(totalAmount);
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setCreatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // 9. Return Response DTO
        return BookingResponseDto.builder()
                .bookingId(savedBooking.getBookingId())
                .bookingReference(bookingRef)
                .movieTitle(show.getMovie().getTitle())
                .theatreName(show.getScreen().getTheatre().getTheatreName())
                .screenName(show.getScreen().getScreenName())
                .showDate(show.getShowDate())
                .showTime(show.getShowTime())
                .customerName(request.getCustomerName())
                .totalAmount(totalAmount)
                .paymentMethod(request.getPaymentMethod().name())
                .paymentStatus("SUCCESS")
                .bookedSeatNumbers(selectedSeats.stream().map(s -> s.getSeat().getSeatNumber()).toList())
                .build();
    }
}`,
  },
  {
    id: 'booking-controller',
    name: 'BookingController.java',
    category: 'backend',
    language: 'java',
    description: 'REST Controller exposing endpoints for browsing movies, shows, seat layouts, and submitting bookings.',
    path: 'src/main/java/com/bookmyshow/controller/BookingController.java',
    code: `package com.bookmyshow.controller;

import com.bookmyshow.dto.*;
import com.bookmyshow.service.BookingService;
import com.bookmyshow.service.MovieService;
import com.bookmyshow.service.ShowService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows React or any client to connect
public class BookingController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private ShowService showService;

    @Autowired
    private BookingService bookingService;

    // 1. Get All Now Showing Movies
    @GetMapping("/movies")
    public ResponseEntity<List<MovieDto>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    // 2. Get Shows for a Movie on a given Date
    @GetMapping("/movies/{movieId}/shows")
    public ResponseEntity<List<ShowDto>> getShowsForMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(showService.getShowsByMovieId(movieId));
    }

    // 3. Get Seat Matrix with Categories (Recliner, Prime, Classic) & Availability for a Show
    @GetMapping("/shows/{showId}/seats")
    public ResponseEntity<SeatMapResponseDto> getSeatMapForShow(@PathVariable Long showId) {
        return ResponseEntity.ok(showService.getSeatMap(showId));
    }

    // 4. Submit Ticket Booking (Atomic Transaction)
    @PostMapping("/bookings/create")
    public ResponseEntity<BookingResponseDto> createBooking(@Valid @RequestBody BookingRequestDto request) {
        BookingResponseDto response = bookingService.createBooking(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}`,
  },
  {
    id: 'mvc-controller',
    name: 'WebViewController.java',
    category: 'frontend',
    language: 'java',
    description: 'Spring MVC Controller rendering server-side Thymeleaf HTML views for pure Java-based web frontends.',
    path: 'src/main/java/com/bookmyshow/controller/WebViewController.java',
    code: `package com.bookmyshow.controller;

import com.bookmyshow.service.MovieService;
import com.bookmyshow.service.ShowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class WebViewController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private ShowService showService;

    // Home Page: List Movies (BookMyShow style)
    @GetMapping("/")
    public String viewHomePage(Model model) {
        model.addAttribute("movies", movieService.getAllMovies());
        return "index"; // renders templates/index.html
    }

    // Seat Selection Page for a Show
    @GetMapping("/shows/{showId}/book")
    public String viewSeatSelection(@PathVariable Long showId, Model model) {
        model.addAttribute("show", showService.getShowById(showId));
        model.addAttribute("seatMap", showService.getSeatMap(showId));
        return "seat-layout"; // renders templates/seat-layout.html
    }
}`,
  },
  {
    id: 'thymeleaf-template',
    name: 'seat-layout.html',
    category: 'frontend',
    language: 'html',
    description: 'Thymeleaf HTML5 & Tailwind CSS Seat Selection UI rendering categorized seats (Recliner, Prime, Classic) and checkout drawer.',
    path: 'src/main/resources/templates/seat-layout.html',
    code: `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title th:text="\${show.movieTitle + ' | Book Seats'}">BookMyShow Seat Selection</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-zinc-950 text-zinc-100 font-sans min-h-screen">
    <header class="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
        <div>
            <h1 class="text-xl font-bold text-amber-500" th:text="\${show.movieTitle}">Movie Title</h1>
            <p class="text-xs text-zinc-400" th:text="\${show.theatreName + ' | ' + show.screenName + ' | ' + show.showTime}">Show info</p>
        </div>
        <div class="text-sm font-mono text-zinc-300">
            Base Ticket: ₹<span th:text="\${show.basePrice}">200</span>
        </div>
    </header>

    <main class="max-w-4xl mx-auto py-8 px-4">
        <!-- Cinema Screen Curve -->
        <div class="text-center mb-10">
            <div class="h-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full shadow-lg"></div>
            <p class="text-[11px] text-zinc-500 uppercase tracking-widest mt-2 font-mono">All eyes this way</p>
        </div>

        <!-- Tiered Seat Sections: RECLINER, PRIME, CLASSIC -->
        <div class="space-y-6">
            <!-- RECLINER SECTION -->
            <div class="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                <div class="flex justify-between items-center mb-3">
                    <span class="text-xs font-bold text-amber-400 uppercase font-mono">Recliner Section (₹350)</span>
                </div>
                <div class="flex flex-wrap gap-3 justify-center">
                    <button class="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-mono hover:bg-amber-500 hover:text-black">R1</button>
                    <button class="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-mono hover:bg-amber-500 hover:text-black">R2</button>
                    <button class="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-mono hover:bg-amber-500 hover:text-black">R3</button>
                    <button class="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-mono hover:bg-amber-500 hover:text-black">R4</button>
                </div>
            </div>

            <!-- PRIME SECTION -->
            <div class="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                <div class="flex justify-between items-center mb-3">
                    <span class="text-xs font-bold text-zinc-300 uppercase font-mono">Prime Section (₹220)</span>
                </div>
                <div class="flex flex-wrap gap-2.5 justify-center">
                    <button class="w-9 h-9 rounded bg-zinc-800 border border-zinc-700 text-xs font-mono hover:bg-amber-500 hover:text-black">P1</button>
                    <button class="w-9 h-9 rounded bg-zinc-800 border border-zinc-700 text-xs font-mono hover:bg-amber-500 hover:text-black">P2</button>
                    <button class="w-9 h-9 rounded bg-zinc-900 text-red-500/50 cursor-not-allowed border border-red-950 font-mono" disabled>XX</button>
                    <button class="w-9 h-9 rounded bg-zinc-800 border border-zinc-700 text-xs font-mono hover:bg-amber-500 hover:text-black">P4</button>
                    <button class="w-9 h-9 rounded bg-zinc-800 border border-zinc-700 text-xs font-mono hover:bg-amber-500 hover:text-black">P5</button>
                </div>
            </div>
        </div>

        <!-- Sticky Payment CTA -->
        <div class="fixed bottom-0 left-0 right-0 bg-zinc-900/95 border-t border-zinc-800 p-4 backdrop-blur-md">
            <div class="max-w-4xl mx-auto flex justify-between items-center">
                <div>
                    <span class="text-xs text-zinc-400 block font-mono">Selected: 2 Seats (P1, P2)</span>
                    <span class="text-lg font-bold text-emerald-400">Total: ₹440.00</span>
                </div>
                <button class="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm transition-all shadow-lg">
                    Proceed to Payment →
                </button>
            </div>
        </div>
    </main>
</body>
</html>`,
  },
  {
    id: 'dtos',
    name: 'BookingRequestDto.java',
    category: 'backend',
    language: 'java',
    description: 'Data Transfer Objects (DTOs) with validation annotations for incoming booking payload and outgoing ticket details.',
    path: 'src/main/java/com/bookmyshow/dto/BookingRequestDto.java',
    code: `package com.bookmyshow.dto;

import com.bookmyshow.entity.PaymentMethod;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class BookingRequestDto {

    @NotNull(message = "Show ID is mandatory")
    private Long showId;

    @NotEmpty(message = "At least one seat must be selected")
    private List<Long> selectedSeatIds;

    @NotNull(message = "Customer name is mandatory")
    private String customerName;

    private String customerEmail;
    private String customerPhone;

    @NotNull(message = "Payment method must be selected")
    private PaymentMethod paymentMethod; // UPI, CREDIT_CARD, DEBIT_CARD, CASH
}`,
  },
];

export const JavaCodeHub: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>('sql-schema');
  const [copied, setCopied] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const selectedFile =
    JAVA_PROJECT_FILES.find((f) => f.id === selectedFileId) || JAVA_PROJECT_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFiles = JAVA_PROJECT_FILES.filter(
    (f) => filterCategory === 'all' || f.category === filterCategory
  );

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900/40 p-6 rounded-2xl border border-amber-500/20 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-500 text-zinc-950 uppercase tracking-wider">
                BookMyShow Architecture
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Java 17+ • Spring Boot 3 • MySQL 8.0 • REST / Thymeleaf
              </span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100 font-display mt-2">
              Java & SQL Full-Stack Project Generator
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Complete production architecture for a movie ticket booking platform like BookMyShow.
              Includes relational DDL with tiered seat categories, Spring Boot JPA service with atomic ACID transaction concurrency locks, REST controllers, DTOs, and frontend templates.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-md"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Code!' : 'Copy Current File'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
        <span className="text-xs font-mono text-zinc-500">Filter Files:</span>
        {[
          { id: 'all', label: 'All Files (7)' },
          { id: 'sql', label: 'SQL Schema (1)' },
          { id: 'backend', label: 'Java Backend (3)' },
          { id: 'frontend', label: 'Frontend / MVC (2)' },
          { id: 'config', label: 'Maven & Config (2)' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filterCategory === cat.id
                ? 'bg-zinc-800 text-amber-400 font-semibold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Split Layout: File Sidebar + Code Editor Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* File Navigator Sidebar */}
        <div className="lg:col-span-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <FolderTree className="w-4 h-4 text-amber-500" />
              <span>Project Structure</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              {filteredFiles.length} files
            </span>
          </div>

          <div className="space-y-1.5">
            {filteredFiles.map((file) => {
              const isSelected = selectedFileId === file.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-amber-500/10 border border-amber-500/40 text-zinc-100 shadow-sm'
                      : 'hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  {file.category === 'sql' ? (
                    <Database className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : file.category === 'backend' ? (
                    <Server className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : file.category === 'frontend' ? (
                    <Layout className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  ) : (
                    <FileCode className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  )}

                  <div className="overflow-hidden">
                    <span className="font-mono font-medium block truncate">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 block truncate">
                      {file.path}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* BookMyShow System Architecture Highlights */}
          <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-2 text-xs">
            <h4 className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              BookMyShow Key Highlights:
            </h4>
            <ul className="space-y-1.5 text-[11px] text-zinc-400 list-disc list-inside">
              <li>
                <strong className="text-zinc-200">Anti-Double Booking:</strong> Spring Data JPA <code className="text-amber-300">PESSIMISTIC_WRITE</code> lock avoids race conditions.
              </li>
              <li>
                <strong className="text-zinc-200">Tiered Pricing:</strong> Recliner (₹350), Prime (₹220), Classic (₹150).
              </li>
              <li>
                <strong className="text-zinc-200">Multi-Seat Cart:</strong> 1 to 6 seats per transaction via <code className="text-amber-300">booking_seats</code> junction table.
              </li>
              <li>
                <strong className="text-zinc-200">ACID Transactions:</strong> Rolled back automatically if seat is locked or payment fails.
              </li>
            </ul>
          </div>
        </div>

        {/* Code Display Panel */}
        <div className="lg:col-span-8 bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
          {/* File Header Tab */}
          <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-mono text-xs font-semibold text-zinc-200">
                {selectedFile.path}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 uppercase">
                {selectedFile.language}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 font-mono transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Description banner */}
          <div className="px-4 py-2 bg-zinc-900/40 border-b border-zinc-800/60 text-xs text-zinc-400">
            {selectedFile.description}
          </div>

          {/* Code Viewer */}
          <div className="p-4 overflow-x-auto max-h-[580px] text-xs font-mono text-zinc-300 leading-relaxed select-text">
            <pre className="text-amber-100/90 font-mono">{selectedFile.code}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
