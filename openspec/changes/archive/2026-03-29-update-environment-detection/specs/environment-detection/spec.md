## ADDED Requirements
### Requirement: Real-time Node.js Version Detection
The system MUST invoke `node -v` in the host shell to determine if Node.js is installed locally and read its version output.

#### Scenario: Node.js is installed
- **WHEN** the host system has Node.js installed in its system path
- **THEN** it executes the `node -v` command successfully and captures the return output
- **AND** updates the Environment list to show Node.js as installed alongside its output version

#### Scenario: Node.js is missing
- **WHEN** execution of `node -v` fails (e.g., command not found)
- **THEN** it safely suppresses the exception
- **AND** sets the Environment configuration to indicate Node.js as NOT installed

### Requirement: Real-time OpenClaw Version Detection
The system MUST invoke `openclaw -v` in the host shell to aggressively check for the presence and version of the OpenClaw CLI, which operates as a primary indicator of its installation.

#### Scenario: OpenClaw CLI is installed
- **WHEN** the host system has OpenClaw CLI installed and in PATH
- **THEN** it executes `openclaw -v` successfully
- **AND** updates the installation status correctly with the matched version string

#### Scenario: OpenClaw CLI is not installed
- **WHEN** `openclaw -v` command fails internally
- **THEN** it suppresses the error output
- **AND** changes the overall installation state to false, marking the software as absent
