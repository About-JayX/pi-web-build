// 模拟代币持有人数据 - 使用SOL地址格式
export interface TokenHolder {
    address: string;
    percentage: number;
  }
  
  // 所有代币通用的持币分布数据
  export const mockTokenHolders: TokenHolder[] = [
    { address: '2JzP1YAVNDSVv8QcvJGJ5AyCENjcf9Rm7XY5yTiX7TGZ', percentage: 0.99 },
    { address: 'PancakeSwapLP23MZ9mZJ7UfEFrGZz9DU9nLQ4UPA5', percentage: 0.98 },
    { address: '38RcGgxZNrTQnPZU4ayAzEgs7nzJ2CnBjgxKwD9XSJBX', percentage: 0.96 },
    { address: 'FxgpP9MSxW2fJWuH95r4bGGsSBGiWRZbK3WoNJgrpTGS', percentage: 0.96 },
    { address: 'Burn9EqukhBipYuVUMS7aDJe5u4SWEcVNyRqQiV2abJt', percentage: 0.95 },
    { address: 'BLVnZrXYTcnS9JwYCEU7KinLBGRhZtaS5FMGm4SVXWzG', percentage: 0.95 },
    { address: 'GkZPEmsrCHQzgKEZ8xgzhoH2JjxE9JMetaRJvUW6zNbM', percentage: 0.93 },
    { address: '9ZheY1mJAKrVjkJ6YAvmE8yvdmmaTdQ1JxzU6mfKKYYJ', percentage: 0.92 },
    { address: '7Nra8qCxM5ygVEAsMTFpAVTpz3stUGcNRAdv6CdJVt1h', percentage: 0.92 },
    { address: 'BwJcAWxaGqBBh9SjC1ZDkQaK5UfMnKuPHYNSsB3UbBpn', percentage: 0.90 },
    { address: 'CkAhYcY83W3uG2KFGrZqACrGxsurXGEAEEehBHvjz6co', percentage: 0.90 },
    { address: '6Jx1Vxyc9KE2JYZj7RN8zzRB5jj2XYQhTpK2sMJPEbBP', percentage: 0.89 },
    { address: 'FWzeS7Rk6TDDMRzN5ZypJKQhS2vWA5mtFTL9iwArJnwy', percentage: 0.89 },
    { address: 'HqnaMDJTT6pJ2nyJh4gnKLzuKXw5TyGUEJZzx5tgH9Td', percentage: 0.88 },
    { address: 'Ea4PsHxAVJBJu1VjD1M9fZURhMPTe9JkG1oVKQYnhKpR', percentage: 0.88 },
    { address: 'DKWpBXXCVRCpznjQGpcgy8n2WbcZ12hV9WmZLbAykpCV', percentage: 0.85 },
    { address: 'CsVHQHrqYPRmgdKN7qY5zAEZKz3vgd9TKSXJqgzH5zZg', percentage: 0.85 },
    { address: 'Dv9qHGFJbALvZnT7mhJ3rex4M4xvKFNMeU4JaYtFfLD5', percentage: 0.83 },
    { address: 'GVtNKZMeHNEkLPdXSkFYUPGN3NtVFEQFC1CRmYctaPnt', percentage: 0.81 },
    { address: '9FNzRGXQstMzxANKPvqQrMWxdFqUTiTfHzqQP6WNjxri', percentage: 0.79 },
    { address: 'BXS7jSHPXiiz9YEVTRkKwNPgJeP5h3z1jkTi9VYrWxQb', percentage: 0.78 },
    { address: 'HWrL6CsXk5SRDd1gZ9LEnFJ9qpGCRYgZ5SJYQVCh1yKr', percentage: 0.76 },
    { address: '2tWL5quTAXXLdQUAFdaEenKbLQXyBu85eiEVqvPPNYgN', percentage: 0.73 },
    { address: 'C9T3YjLz5FCGYjmPSKZ5U1RRNdmXGvK3QahmVK2NAeZf', percentage: 0.71 },
    { address: 'CUMDXZz9nuQHjcnyFYthuG4aoCE3JBmhGzZQDrWKhw4W', percentage: 0.70 },
    { address: 'BkpumeWahtTUKX8buJQZMzRqoEKG9KFaJffjLdezAGrA', percentage: 0.69 },
    { address: 'FAcnxQ1tYNDxCnEhcxFDi1jtKVBgE3kyzqT6RoQCQzT4', percentage: 0.67 },
    { address: '5znjWYC7q8B5LrgQAcA6YUyeSD8eGF1tFiW3zstoj54n', percentage: 0.65 },
    { address: 'H6hE9hrdpWeBgZf5dRYdYDKvAzGKfbkMVoQinYs2nKzc', percentage: 0.63 },
    { address: '7xHMsqgNpbzXM6Qfm6TtUfyh3NFYqiLZxYW6hXTHkTQh', percentage: 0.62 },
    { address: 'GZHoAHuPXXPvmJeEfUQuoXMcbKmV3YMDhU9SdpckWMGo', percentage: 0.60 },
    { address: 'GjQz5n8sY5D2sAvnGNAQRvHfYy5AzmgQYCKDX3dMqRKA', percentage: 0.59 },
    { address: '5sAwKWLF1sUGjXHAEovTkCXTSYRfJVnXiGCbvZHMgmP5', percentage: 0.58 },
    { address: 'Fq9XRB7HKP6X6cQUKKpr1N3MUMxQKngpaK7k6f8DBmEc', percentage: 0.57 },
    { address: '5L6nDyXL1EnaNLWXsveRf2QCDeNpKCWW9T9JKvTNHiKU', percentage: 0.55 },
    { address: '3Tb6SypKuZehUF8eABu23Ai8E1sMKTqsF5aNZXuMY64A', percentage: 0.54 },
    { address: 'GVUPvK1As7a31gAwgVeKH2BXpywRWFqmJzT9RW5M9R62', percentage: 0.52 },
    { address: '9nDkNcYxYfVWqSJnQLVLjrXz9AzqVTFqEEzYyJQxkZvQ', percentage: 0.50 },
  ];
  
  // 导出函数，用于获取特定代币的持有人数据
  export const getTokenHolders = (tokenAddress: string): TokenHolder[] => {
    return mockTokenHolders;
  };
  