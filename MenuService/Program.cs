﻿using MenuService.Kafka;
using MenuService.Models;

var builder = WebApplication.CreateBuilder(args);

var kafkaBootstrapServers = Environment.GetEnvironmentVariable("KAFKA_BROKER") ?? "localhost:9092";
var kafkaTopic = Environment.GetEnvironmentVariable("KAFKA_TOPIC") ?? "menu-events";

builder.Services.AddSingleton(new KafkaProducer(kafkaBootstrapServers, kafkaTopic));

// Load MongoDB settings from appsettings.json
builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("DatabaseSettings"));

// Add MenuService to the dependency container
builder.Services.AddSingleton<MenuService.Services.MenuService>();

// Enable minimal API or Controllers
builder.Services.AddControllers(); // <- Enable controllers if you're using them

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS to allow any origin
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Swagger setup
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors( options =>
{
    options.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader();
});

app.UseAuthorization();

app.MapControllers();

app.Run();
