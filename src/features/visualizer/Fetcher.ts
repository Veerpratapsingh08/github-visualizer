export type RepoFile = {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number; // Size in bytes
  url: string;
};

export type RepoTree = {
  sha: string;
  url: string;
  tree: RepoFile[];
  truncated: boolean;
};

// Rate limit helper
async function checkRateLimit(response: Response) {
  if (response.status === 403 || response.status === 429) {
    const reset = response.headers.get("x-ratelimit-reset");
    const resetTime = reset ? new Date(parseInt(reset) * 1000).toLocaleTimeString() : "unknown";
    throw new Error(`API Rate Limit Exceeded. Resets at ${resetTime}. Try providing a token.`);
  }
}

export const fetchRepoTree = async (owner: string, repo: string, token?: string) => {
  const headers: HeadersInit = {
    "Accept": "application/vnd.github+json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 1. Get default branch sha
  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  await checkRateLimit(repoRes);
  if (!repoRes.ok) throw new Error("Repository not found");
  
  const repoData = await repoRes.json();
  const defaultBranch = repoData.default_branch;

  // 2. Get Tree recursively
  const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, { headers });
  await checkRateLimit(treeRes);
  if (!treeRes.ok) throw new Error("Failed to fetch tree");

  const treeData: RepoTree = await treeRes.json();
  return treeData.tree;
};

export const parseRepoUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] };
    }
  } catch (e) {
    // Handle "owner/repo" format without https
    const parts = url.split("/").filter(Boolean);
    if (parts.length === 2) {
      return { owner: parts[0], repo: parts[1] };
    }
  }
  return null;
};
