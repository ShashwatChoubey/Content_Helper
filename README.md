Content Helper
A Full-Stack AI-Powered Audio Generation Platform

Content Helper is a production-ready SaaS application that brings AI-powered audio generation into a scalable, credit-controlled platform.

Inspired by ElevenLabs, this system is built with:

Multi-model microservice architecture

Backend-enforced credit validation

Dockerized AI services

Scalable cloud storage

🔗 Live Demo: https://content-helper-u61q.vercel.app/

🔗 GitHub Repository: https://github.com/ShashwatChoubey/Content_Helper

🚀 Features

Content Helper provides a complete suite of AI audio capabilities:

Text-to-Speech – Convert written text into natural-sounding speech

Speech-to-Speech – Transform voices while preserving the original message

Music Generation – Create original music from text prompts

Speech-to-Text – Transcribe audio into accurate text

All features operate through a secure, backend-controlled credit system that ensures fair usage and prevents abuse.

🧠 AI Models

Each task uses a specialized, production-ready model:

Task	Model	Why This Model?
Text-to-Speech	StyleTTS2	High-quality neural speech synthesis with customizable voice weights
Speech-to-Speech	RVC	Industry-standard voice conversion with strong quality-to-performance ratio
Music Generation	MusicGen Small	Lightweight model optimized for CPU inference
Speech-to-Text	Whisper	Robust multi-language transcription model

All models run with preconfigured weights and are optimized for CPU-based inference, enabling cost-efficient deployment without requiring GPUs.

🏗 Architecture

Content Helper follows a microservices architecture with strict separation of concerns.

User Request
      ↓
React Frontend (Vercel)
      ↓
TypeScript Backend (T3 Stack)
      ├── Credit Validation
      ├── Request Orchestration
      └── History Tracking
      ↓
FastAPI Model Services (Dockerized)
      ├── Text-to-Speech Service
      ├── Speech-to-Speech Service
      ├── Music Generation Service
      └── Speech-to-Text Service
      ↓
AWS S3 (Audio Storage)
      ↓
Prisma Database (PostgreSQL)

🏛 Why This Architecture?
1️⃣ Model Isolation

Each AI model runs in its own containerized service.

This ensures:

Failures do not cascade

Models can be updated independently

Resource allocation is controlled

Dependency conflicts are eliminated

2️⃣ Backend Authority

The TypeScript backend is the single source of truth.

Credits are validated and deducted server-side

No client-side manipulation is possible

All requests are authenticated

Full generation history is tracked

3️⃣ Scalable Storage

AWS S3 is used for storing generated audio:

No binary blobs stored in the database

Virtually unlimited scalability

Fast and reliable access

Only S3 keys are stored in PostgreSQL

4️⃣ Clean Relational Data Model
Users Table

id (Primary Key)

email

credits

created_at

Audio_History Table

id (Primary Key)

user_id (Foreign Key → Users)

task_type

s3_key

created_at

metadata

This relational structure ensures:

Data integrity

Proper user isolation

Efficient queries

Scalable history tracking

🛠 Tech Stack
Layer	Technology	Purpose
Frontend	React	Modern responsive UI
Backend	TypeScript (T3 Stack)	Type-safe server logic
Database	Prisma + PostgreSQL	ORM with relational integrity
AI Services	FastAPI	High-performance Python APIs
Containerization	Docker	Isolated, consistent runtime
Storage	AWS S3	Scalable object storage
Model Hosting	Hugging Face Spaces	Reliable model deployment
Frontend Hosting	Vercel	Global CDN delivery
⚙️ Key Engineering Decisions
🔐 Security & Control

Backend-enforced credit system ensures no client-side tampering. All validation occurs server-side before inference execution.

📈 Scalability

One model = One container.
This enables independent scaling and deployment of services.

💰 Cost Efficiency

All models are CPU-optimized to allow deployment on free-tier or low-cost infrastructure.

🧩 Maintainability

Modular FastAPI services and isolated containers simplify debugging and feature extension.

📦 Reliability

S3-backed storage prevents database bloat and ensures consistent access to generated audio files.


📌 Future Improvements

Queue-based processing for high concurrency

Distributed locking for credit race-condition prevention

GPU inference optimization

Monitoring and observability layer

Rate limiting

Stripe billing integration

Horizontal scaling for model services

🎯 Project Goal

This project demonstrates:

Full-stack AI SaaS architecture

Secure backend credit enforcement

Multi-model orchestration

Dockerized microservices

Scalable cloud storage integration

Production-oriented system design
