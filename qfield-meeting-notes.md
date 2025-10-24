# QField Assistant - Meeting Preparation Documentation

## Agent Overview
**Agent Name:** qfield-assistant
**Location:** `/home/louisdup/Agents/Mastra/mastra agent builder/src/mastra/agents/qfield-assistant.agent.ts`
**Purpose:** Expert assistant for QGIS and QField support, configured to help Juan and team with geospatial workflows.

## Access
- **Mastra Playground:** http://localhost:4113/
- **API Endpoint:** http://localhost:4113/api
- **Agent:** Select "qfield-assistant" from the agent dropdown

---

## Core Knowledge Areas

### 1. QGIS (Quantum GIS)
#### What is QGIS?
- Free and Open Source Geographic Information System
- Cross-platform: Windows, Mac, Linux
- Licensed under GNU GPLv2+
- Community-driven development

#### Key Capabilities
1. **Map Creation & Cartography**
   - Professional map production
   - Layout designer for print-quality maps
   - Atlas and report generation

2. **Layer Editing**
   - Digitizing points, lines, polygons, meshes
   - CAD-like construction tools
   - Customizable forms

3. **Data Processing & Analysis**
   - Comprehensive analysis toolset
   - Visual workflow creation
   - Third-party tool integration

4. **Data Sharing**
   - Multiple format support
   - Industry standard compliance
   - Cloud and mobile publishing

---

### 2. QField Mobile App
#### What is QField?
- Mobile GIS for field data collection
- Seamless QGIS integration
- Online/offline capabilities
- Open source (GPL v2+)

#### Key Features
- Real-time synchronization
- Survey forms with constraints
- Collaborative data collection
- Multiple file format support (GeoPackage, KML, GPX)

#### Typical Workflow
1. Design project in QGIS
2. Sync to QField mobile
3. Collect data in field (online/offline)
4. Sync back to QFieldCloud
5. Review and analyze in QGIS

---

### 3. QFieldCloud Infrastructure
#### What is QFieldCloud?
- Django-based sync service
- Bridges QGIS and QField
- Team management platform
- Open source (MIT license)

#### Technical Architecture
- PostgreSQL/PostGIS database
- Docker-based deployment
- MinIO or S3-compatible storage
- NGINX reverse proxy with SSL
- Let's Encrypt support

#### Core Features
1. **Synchronization**
   - Real-time project/data sync
   - Change tracking
   - Online/offline work
   - Conflict resolution

2. **Team Management**
   - User access control
   - Project sharing
   - Activity tracking
   - Collaborative workflows

3. **Deployment Options**
   - Hosted (Swiss data centers)
   - Private cloud instances
   - Self-hosted
   - Dev/staging/production environments

#### Important Resources
- **API Docs:** https://app.qfield.cloud/swagger/
- **Status Page:** http://status.qfield.cloud/
- **GitHub:** https://github.com/opengisch/QFieldCloud
- **Website:** https://qfield.cloud

---

## Common Use Cases

### Industry Applications
- Archaeological research
- Conservation projects
- Land surveying
- Government data collection
- Humanitarian/UN initiatives
- Environmental monitoring
- Infrastructure mapping
- Agricultural surveys

### Workflow Scenarios

#### 1. Field Survey Project
1. Create QGIS project with custom forms
2. Configure validation rules
3. Publish to QFieldCloud
4. Team collects data on mobile
5. Real-time sync and review
6. Analyze in QGIS

#### 2. Offline Data Collection
1. Sync project to device offline
2. Collect without internet
3. Sync when online
4. Automatic conflict resolution

#### 3. Collaborative Mapping
1. Multiple team members
2. Real-time updates
3. Change tracking
4. Centralized management

---

## Technical Integration Flow

### QGIS → QFieldCloud → QField

#### QGIS Setup
- Install QFieldSync plugin
- Configure for mobile use
- Design forms and validation
- Set up symbology and layers

#### QFieldCloud Configuration
- Create project
- Configure permissions
- Set sync parameters
- Manage storage/backups

#### QField Mobile
- Download project
- Collect/edit data
- Attach photos/media
- Sync when available

---

## Best Practices

### Project Design
- Keep projects lightweight for mobile
- Use GeoPackage format (recommended)
- Configure validation upfront
- Test on mobile before deployment

### Data Management
- Regular sync schedules
- Backup strategies
- Clear naming conventions
- Version control

### Team Coordination
- Clear role definitions
- Communication protocols
- Training on workflows
- Regular quality checks

### Performance Optimization
- Optimize layer visibility scales
- Appropriate symbology complexity
- Manage offline area sizes
- Regular cache management

---

## Installation Quick Reference

### QFieldCloud Self-Hosting
```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/opengisch/QFieldCloud

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Build and deploy
docker-compose build
docker-compose up -d

# Run migrations
docker-compose exec app python manage.py migrate

# Collect static files
docker-compose exec app python manage.py collectstatic
```

---

## Support Resources

### Documentation
- **QGIS:** https://qgis.org/
- **QField Cloud:** https://qfield.cloud/
- **GitHub Repo:** https://github.com/opengisch/QFieldCloud

### Community
- Local user groups
- Annual QGIS conferences
- GitHub issues and discussions

### Professional Support
- **Developer:** OPENGIS.ch
- Offers consulting and support services
- Custom implementations available

---

## Meeting Talking Points

### Questions to Consider
1. **Current Setup**
   - Using hosted or self-hosted QFieldCloud?
   - Team size and roles?
   - Current QGIS version?

2. **Use Case**
   - What type of field data collection?
   - Online/offline requirements?
   - Data volume and complexity?

3. **Technical Needs**
   - Integration requirements?
   - Performance concerns?
   - Security/compliance needs?

4. **Challenges**
   - Current pain points?
   - Workflow bottlenecks?
   - Training needs?

### Key Advantages to Highlight
- **Open Source:** No vendor lock-in
- **Swiss Hosted:** High quality infrastructure
- **Flexible:** Hosted or self-hosted options
- **Integrated:** Seamless QGIS workflow
- **Proven:** Used by UN, governments, research

---

## How to Use the Agent

### In Mastra Playground
1. Navigate to http://localhost:4113/
2. Select "qfield-assistant" from dropdown
3. Start conversation with technical questions
4. Agent has full knowledge of QGIS/QField/QFieldCloud

### Example Questions to Ask
- "How do I set up offline data collection for a survey project?"
- "What's the best way to configure forms in QGIS for mobile use?"
- "How does the sync process work between QGIS and QField?"
- "What are the deployment options for QFieldCloud?"
- "How do I handle conflicts in collaborative editing?"

### Agent Capabilities
- Technical troubleshooting
- Workflow recommendations
- Best practice guidance
- Architecture advice
- Integration support

---

## Notes
- Agent uses GPT-4o model for high-quality responses
- Has conversation memory for meeting context
- Tracks discussion topics, questions, and action items
- Can provide both high-level overview and deep technical details

---

**Created:** 2025-10-24
**For Meeting With:** Juan
**Purpose:** QField/QGIS technical assistance and consulting
