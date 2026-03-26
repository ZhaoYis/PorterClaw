import http from 'http';

export type NodeStatus = 'connected' | 'disconnected' | 'unavailable';

const GATEWAY_API_HOST = 'localhost';
const GATEWAY_API_PORT = 8080;
const GATEWAY_API_TIMEOUT = 3000;

interface GatewayNodesResponse {
  nodes?: Array<{
    id: string;
    status: string;
  }>;
  count?: number;
}

/**
 * Query Gateway API for connected nodes
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
 * Get Node status
 */
export async function getNodeStatus(): Promise<NodeStatus> {
  try {
    // Try to query Gateway API for nodes
    const response = await queryGatewayAPI<GatewayNodesResponse>('/api/v1/nodes');

    if (response === null) {
      // Gateway API not available
      return 'unavailable';
    }

    // Check if there are connected nodes
    if (response.nodes && response.nodes.length > 0) {
      const hasConnected = response.nodes.some(
        (node) => node.status === 'connected' || node.status === 'active'
      );
      return hasConnected ? 'connected' : 'disconnected';
    }

    if (response.count && response.count > 0) {
      return 'connected';
    }

    return 'disconnected';
  } catch (error) {
    console.error('Error getting Node status:', error);
    return 'unavailable';
  }
}

/**
 * Get number of connected nodes
 */
export async function getConnectedNodesCount(): Promise<number> {
  try {
    const response = await queryGatewayAPI<GatewayNodesResponse>('/api/v1/nodes');

    if (response === null) {
      return 0;
    }

    if (response.count !== undefined) {
      return response.count;
    }

    if (response.nodes) {
      return response.nodes.filter(
        (node) => node.status === 'connected' || node.status === 'active'
      ).length;
    }

    return 0;
  } catch {
    return 0;
  }
}
