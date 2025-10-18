package com.sports.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * MongoDB Configuration
 */
@Configuration
@EnableMongoRepositories(basePackages = "com.sports.repository")
@EnableMongoAuditing
public class MongoConfig {
    // Configuration handled by DotenvConfig
}
