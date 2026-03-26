import http from 'http';

const GATEWAY_API_HOST = 'localhost';
const GATEWAY_API_PORT = 8080;
const GATEWAY_API_TIMEOUT = 3000;

interface SkillsResponse {
  skills?: Array<{
    id: string;
    status: string;
  }>;
  active?: number;
  total?: number;
}

interface TasksResponse {
  tasks?: Array<{
    id: string;
    status: string;
  }>;
  running?: number;
}

/**
 * Query Gateway API
 */
async function queryGatewayAPI<T>(endpoint: string): Promise<T | null> {
  return new Promise((resolve) => {
    const options = {
      hostname: GATEWAY_API_HOST,
      port: GATEWAY_API_PORT,
      path: endpoint,
      method: 'GET',
      timeout: GATEWAY_API_TIMEOUT,
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data) as T);
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
    });

    req.on('error', () => {
      resolve(null);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });

    req.end();
  });
}

/**
 * Get active skills count from Gateway API
 */
export async function getActiveSkillsCount(): Promise<number> {
  try {
    // Try skills endpoint first
    const skillsResponse = await queryGatewayAPI<SkillsResponse>('/api/v1/skills');

    if (skillsResponse !== null) {
      // Check for active count
      if (skillsResponse.active !== undefined) {
        return skillsResponse.active;
      }

      // Count active skills from array
      if (skillsResponse.skills) {
        return skillsResponse.skills.filter(
          (skill) => skill.status === 'active' || skill.status === 'running'
        ).length;
      }
    }

    // Fallback: try tasks endpoint
    const tasksResponse = await queryGatewayAPI<TasksResponse>('/api/v1/tasks');

    if (tasksResponse !== null) {
      if (tasksResponse.running !== undefined) {
        return tasksResponse.running;
      }

      if (tasksResponse.tasks) {
        return tasksResponse.tasks.filter(
          (task) => task.status === 'running' || task.status === 'active'
        ).length;
      }
    }

    // No data available
    return 0;
  } catch (error) {
    console.error('Error getting active skills count:', error);
    return 0;
  }
}

/**
 * Mock skills count for demo purposes when Gateway is not available
 * This returns a simulated count based on time
 */
export function getMockSkillsCount(): number {
  // Return a semi-random number between 8-15 for demo
  const base = 10;
  const variation = Math.sin(Date.now() / 60000) * 3;
  return Math.max(0, Math.round(base + variation));
}
