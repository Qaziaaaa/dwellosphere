# AGENT.md

# DwelloSphere Engineering Agent Guide

This document defines standards, architecture, conventions, workflows, and implementation rules for all AI coding agents contributing to DwelloSphere.

Agents must follow these instructions strictly.

---

# Project Overview

DwelloSphere is an enterprise-grade Real Estate SaaS platform designed for:

- Rentals
- Property Sales
- Property Management
- Tenant Management
- CRM
- Booking System
- Payments
- Analytics
- AI Recommendations
- Subscription Billing

This repository should reflect production-level engineering practices.

Goal:

Build a platform that demonstrates senior-level full-stack expertise, modern SaaS architecture, and AI integration.

---

# Core Principles

Prioritize:

Scalability

Maintainability

Developer Experience

Performance

Security

Accessibility

Observability

Testability

Clean Architecture

Domain Driven Design

SOLID Principles

Reusable Components

Type Safety

Consistency

---

# Engineering Philosophy

Prefer:

Readable code over clever code

Composition over inheritance

Server Components when possible

Feature-driven architecture

Thin controllers

Fat services

Strict validation

Centralized business logic

Background processing

Event-driven communication

Optimistic UI

Graceful degradation

Progressive enhancement

---

# Tech Stack

## Frontend

Next.js 16

React 19

TypeScript

TailwindCSS

Shadcn UI

TanStack Query

React Hook Form

Zod

Framer Motion

Mapbox

Recharts

Socket.io

---

## Backend

NestJS

GraphQL

REST APIs

Prisma ORM

PostgreSQL

Redis

BullMQ

CQRS

WebSockets

Event Bus

---

## AI

OpenAI

LangChain

pgvector

Embeddings

RAG

Semantic Search

Recommendation Models

Document Processing

---

## Infrastructure

Docker

GitHub Actions

Terraform

Kubernetes Ready

Cloudflare R2

AWS S3

Nginx

Prometheus

Grafana

Sentry

OpenTelemetry

---

# Architecture

DwelloSphere follows modular monolith architecture.

Future migration path:

Modular Monolith

↓

Service Extraction

↓

Microservices

↓

Distributed Systems

---

# Layers

Presentation Layer

↓

API Layer

↓

Application Layer

↓

Domain Layer

↓

Infrastructure Layer

↓

Persistence Layer

---

# Modules

Auth

Users

Organizations

Teams

Properties

Bookings

Leases

Applications

Payments

Subscriptions

CRM

Analytics

Messaging

Notifications

AI

Maintenance

Documents

Search

Reviews

Admin

---

# Folder Structure

apps/

web/

dashboard/

admin/

mobile/

services/

api/

workers/

packages/

ui/

config/

database/

shared/

types/

utils/

schemas/

hooks/

constants/

docs/

infrastructure/

docker/

scripts/

tests/

---

# Frontend Standards

Use App Router.

Prefer Server Components.

Use Client Components only when necessary.

Pages must remain thin.

Business logic belongs in services.

Never place API logic inside UI components.

Prefer custom hooks.

Avoid prop drilling.

Use context sparingly.

Prefer feature isolation.

---

# UI Standards

Design language:

Modern SaaS

Minimal

Premium

Clean

Accessible

Elegant

Enterprise

Requirements:

Responsive

Mobile-first

WCAG AA

Keyboard accessible

Dark mode

Light mode

Animation should be subtle.

Use consistent spacing.

Use design tokens.

Avoid arbitrary values.

---

# Naming Conventions

Components

PropertyCard.tsx

PropertyGrid.tsx

TenantDashboard.tsx

BookingCalendar.tsx

---

Hooks

useProperties()

useBookings()

useTenantProfile()

---

Services

property.service.ts

booking.service.ts

payment.service.ts

recommendation.service.ts

---

Schemas

property.schema.ts

booking.schema.ts

lease.schema.ts

---

Types

property.types.ts

user.types.ts

payment.types.ts

---

# Backend Standards

Controllers should remain thin.

Services contain business logic.

Repositories handle persistence.

DTOs validate inputs.

Never expose database entities directly.

Always transform outputs.

Always validate requests.

Prefer explicit typing.

Avoid any.

Avoid magic strings.

Centralize constants.

---

# Database Standards

Prisma ORM only.

Migration driven development.

No manual schema edits.

Use UUIDs.

Index frequently queried fields.

Implement soft deletes.

Maintain audit history.

Track created_at.

Track updated_at.

Track deleted_at.

Prefer enums.

Normalize data where possible.

Denormalize only for performance.

---

# Security Rules

Mandatory:

RBAC

JWT

Refresh tokens

Session rotation

CSRF protection

Rate limiting

Input validation

Output sanitization

Encryption at rest

Encryption in transit

Secure cookies

Audit logs

2FA

Identity verification

Least privilege access

Tenant isolation

Secrets management

---

# AI Standards

AI features must provide business value.

Avoid gimmicks.

AI modules:

Recommendation Engine

Pricing Advisor

Listing Generator

Lease Summarizer

Property Assistant

Semantic Search

Market Intelligence

Analytics Insights

---

# Recommendation Engine

Inputs:

Budget

Preferences

Location

History

Saved Properties

Search Activity

Booking History

Behavior Events

Outputs:

Recommended Properties

Alternative Neighborhoods

Upsell Suggestions

Trending Areas

---

# Search

Support:

Keyword Search

Hybrid Search

Semantic Search

Natural Language Search

Geo Search

Autocomplete

Ranking

Filters

Sorting

Vector Search

---

# Events

Use event-driven workflows.

Examples:

property.created

property.published

booking.requested

booking.approved

payment.completed

lease.signed

user.registered

maintenance.created

message.sent

subscription.renewed

review.submitted

---

# Background Jobs

BullMQ required.

Examples:

Email jobs

Notifications

Image optimization

AI processing

PDF generation

Analytics aggregation

Embeddings generation

Recommendation updates

Market analysis

Invoice generation

---

# Payments

Support:

Subscriptions

Invoices

Deposits

Rent payments

Commission tracking

Refunds

Payouts

Escrow simulation

Stripe integration

---

# Messaging

Features:

Realtime updates

Typing indicators

Read receipts

Attachments

Images

Notifications

Message history

Search conversations

---

# Booking System

Viewing requests

Approvals

Availability calendar

Rescheduling

Reminders

Calendar sync

Cancellation handling

---

# Analytics

KPIs:

MRR

ARR

Occupancy

Lead Conversion

Revenue

Retention

Bookings

Property Performance

Agent Performance

Forecasting

Growth Metrics

Usage Metrics

---

# Logging

Structured logging only.

Never use console.log in production.

Use logger abstraction.

Include:

timestamp

request id

user id

tenant id

severity

service

metadata

---

# Observability

Prometheus

Grafana

OpenTelemetry

Tracing

Metrics

Distributed logging

Health checks

Performance monitoring

Sentry

---

# Testing Standards

Required:

Unit Tests

Integration Tests

E2E Tests

Contract Tests

API Tests

Accessibility Tests

Smoke Tests

Performance Tests

Security Tests

Coverage target:

80%+

Critical modules:

95%+

---

# API Standards

Version APIs.

Example:

/api/v1/

GraphQL schema-first approach.

Consistent responses.

Success:

{
 success: true,
 data: {}
}

Error:

{
 success:false,
 error:{
   code:"",
   message:""
 }
}

Pagination:

cursor based

preferred over offset

---

# Git Workflow

Branches:

feature/

fix/

refactor/

test/

chore/

docs/

hotfix/

release/

Examples:

feature/property-search

feature/recommendation-engine

fix/payment-bug

refactor/dashboard-layout

---

Commit Format

feat:

fix:

refactor:

docs:

test:

style:

chore:

ci:

perf:

---

Examples

feat(properties): add semantic search

feat(ai): implement recommendation engine

fix(auth): refresh token rotation

refactor(bookings): improve service abstraction

---

# Performance Targets

Lighthouse

95+

Accessibility

100

SEO

100

Best Practices

100

CLS < 0.1

LCP < 2 seconds

TTFB < 300ms

API response < 150ms

Search response < 100ms

---

# Documentation

Every module requires:

README

Architecture notes

ER diagrams

Sequence diagrams

API docs

Examples

Decision records

---

# Definition of Done

Feature is complete only if:

Code implemented

Types added

Validation added

Tests written

Responsive

Accessible

Documented

Reviewed

Performance checked

Security reviewed

Error handling implemented

Analytics tracked

Monitoring added

Logs added

Feature flags supported

---

# Final Objective

DwelloSphere should resemble a venture-backed startup product.

It should demonstrate expertise in:

System Design

Enterprise SaaS

AI Integration

Distributed Architecture

Developer Experience

Product Thinking

Scalable Engineering

Security

Modern Full Stack Development

The project should be strong enough to impress:

FAANG recruiters

Startups

YC companies

Remote SaaS companies

Senior Engineering Managers

Staff Engineers

Technical Interviewers

and serve as a flagship portfolio project.