import type { Request, Response } from "express";
import axios from "axios";

import redisClient, { isRedisConnected } from "../lib/redisClient";

type RepoListType = {
  id: number;
  name: string;
  html_url: string;
  full_name: string;
  description: string;
  img: string;
};

export const fetchGitRepo = async (req: Request, res: Response) => {
  const key = "repo";

  const data = isRedisConnected() ? await redisClient.get(key) : null;
  if (data) {
    return res.json({
      message: "Fetched Repositories successfully-catche",
      repo: JSON.parse(data),
    });
  }
  
  const repo = await axios.get(`https://api.github.com/users`);
  if (isRedisConnected()) {
    await redisClient.setEx(key, 3600, JSON.stringify(repo.data));
  }
  return res.json({
    message: "Fetched successfully",
    repo: repo.data,
  });
};

export const fetchGitRepoByUser = async (req: Request, res: Response) => {
  const { userName } = req.params;
  const key = userName ? userName.toLowerCase() : "repo";

  const data = isRedisConnected() ? await redisClient.get(key) : null;
  if (data) {
    return res.json({
      message: "Fetched Repositories from user successfully-catche",
      repo: JSON.parse(data),
    });
  }

  const url = userName
    ? `https://api.github.com/users/${userName}/repos`
    : `https://api.github.com/users`;

  const repo = await axios.get(url);
  if (repo.status === 200 && repo.data.length > 0) {
    const data = repo.data;
    const listData: RepoListType = data.map((item: any) => ({
      id: item.id,
      repoName: item.name,
      html_url: item.html_url,
      full_name: item.full_name,
      description: item.description,
      img: item.owner.avatar_url,
      name: item.owner.login,
    }));
    if (isRedisConnected()) {
      await redisClient.setEx(key, 3600, JSON.stringify(listData));
    }
    return res.json({
      message: "Fetched Repositories from user successfully",
      repo: listData,
    });
  } else {
    return res.json({
      message: "No Repositories found for this user",
      repo: [],
    });
  }
};

export const fetchNews = async (req: Request, res: Response) => {
  const key = "newsData";

  const data = isRedisConnected() ? await redisClient.get(key) : null;
  if (data) {
    return res.json({
      message: "Fetched News from successfully-catche",
      news: JSON.parse(data),
    });
  }

  const newsData = await axios.get(
    "http://api.mediastack.com/v1/news?access_key=8dac207b11663c2a0324f55f5038fdad"
  );
  if (isRedisConnected()) {
    await redisClient.setEx(key, 3600, JSON.stringify(newsData.data));
  }

  return res.json({
    message: "News fetched successfully",
    news: newsData.data,
  });
};

const publicFetchController = { fetchNews, fetchGitRepo, fetchGitRepoByUser };

export default publicFetchController;
