Content Helper
A full-stack AI-powered audio generation platform
Content Helper is a production-ready SaaS application that brings the power of AI audio generation to your fingertips. Inspired by ElevenLabs, it's built with a robust credit-based system, multi-model architecture, and enterprise-grade backend controls.
🔗 Live Demo | GitHub Repository

What Can It Do?
Content Helper supports a complete suite of AI audio capabilities:

Text-to-Speech – Convert written text into natural-sounding speech
Speech-to-Speech – Transform voices while preserving the original message
Music Generation – Create original music from text descriptions
Speech-to-Text – Transcribe audio into accurate text

All features are powered by state-of-the-art AI models, managed through a credit system that ensures fair usage and prevents abuse.

The Technology Behind It
AI Models
Each task leverages specialized, production-ready models:
TaskModelWhy This Model?Text-to-SpeechStyleTTS2High-quality neural speech synthesis with customizable voice weightsSpeech-to-SpeechRVCIndustry-standard voice conversion with excellent quality-to-performance ratioMusic GenerationMusicGen SmallLightweight yet capable, optimized for CPU inferenceSpeech-to-TextWhisperOpenAI's robust transcription model with multi-language support
All models run with pre-configured weights and are optimized for CPU-based inference, making deployment cost-effective without sacrificing quality.
Architecture
Content Helper follows a microservices architecture with strict separation of concerns:
User Request
    ↓
React Frontend (Vercel)
    ↓
TypeScript Backend (T3 Stack)
    ├─ Credit Validation
    ├─ Request Orchestration
    └─ History Tracking
    ↓
FastAPI Model Services (Dockerized)
    ├─ Text-to-Speech Service
    ├─ Speech-to-Speech Service
    ├─ Music Generation Service
    └─ Speech-to-Text Service
    ↓
AWS S3 (Audio Storage)
    ↓
Prisma Database (PostgreSQL)
Why This Architecture?
1. Model Isolation
Each AI model runs in its own containerized service. This means:

Failures don't cascade across services
Models can be updated independently
Resource allocation is granular and efficient
Dependency conflicts are eliminated

2. Backend Authority
The TypeScript backend acts as the single source of truth:

Credits are validated and deducted server-side only
No client-side manipulation is possible
All requests are authenticated and authorized
Usage history is comprehensively tracked

3. Scalable Storage
AWS S3 handles all audio files:

No large binary data in the database
Infinite scalability for file storage
Fast, reliable content delivery
Simple reference via S3 keys in the database

4. Clean Data Model
Users Table
├─ id (primary key)
├─ email
├─ credits
└─ created_at

Audio_History Table
├─ id (primary key)
├─ user_id (foreign key → Users)
├─ task_type
├─ s3_key
├─ created_at
└─ metadata
This relational design ensures data integrity, proper user isolation, and efficient querying.

Tech Stack
LayerTechnologyPurposeFrontendReactModern, responsive UIBackendTypeScript (T3 Stack)Type-safe server logicDatabasePrisma + PostgreSQLRobust ORM with type safetyAI ServicesFastAPIHigh-performance Python APIsContainerizationDockerConsistent, isolated environmentsStorageAWS S3Scalable object storageModel HostingHugging Face SpacesReliable model deploymentFrontend HostingVercelFast, global CDN delivery

Key Engineering Decisions
Security & Control
Backend-enforced credit system – All credit validation happens server-side, making client-side tampering impossible. This protects against abuse while maintaining a smooth user experience.
Scalability
One model, one container – Each AI model runs in isolation with its own FastAPI service and Docker container. This makes horizontal scaling straightforward when demand increases.
Cost Efficiency
CPU-optimized inference – All models are configured to run efficiently on CPU, enabling deployment on free-tier infrastructure without GPU costs.
Maintainability
Modular API structure – Each model has dedicated API files and endpoints, making debugging, updates, and feature additions simple and safe.
Reliability
S3-backed storage – Generated audio is stored in AWS S3 rather than the database, preventing storage bottlenecks and ensuring files are always accessible.
