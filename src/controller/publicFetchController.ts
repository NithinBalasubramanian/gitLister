import type { Request, Response } from 'express';
import axios from 'axios';

type RepoListType = {
    id: number,
    name: string,
    html_url: string,
    full_name: string,
    description: string,
    img: string    
}

export const fetchGitRepo = async (req: Request, res: Response) => {
    const repo = await axios.get(`https://api.github.com/users`)
    return res.json({
        message: 'Fetched successfully',
        data: repo.data
    });
}

export const fetchGitRepoByUser = async (req: Request, res: Response) => {
    const { userName } = req.params;
    const repo = await axios.get(`https://api.github.com/users/${userName}/repos`)
    if (repo.status === 200 && repo.data.length > 0) {
        const data = repo.data;
        const listData: RepoListType = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            html_url: item.html_url,
            full_name: item.full_name,
            description: item.description,
            img: item.owner.avatar_url
        }));
        return res.json({
            message: 'No Repositories found for this user',
            data: listData
        })
    }
    else{
        return res.json({
            message: 'No Repositories found for this user',
            data: []
        });
    }
}

export const fetchNews = async (req: Request, res: Response) => {
    const newsData = await axios.get('http://api.mediastack.com/v1/news?access_key=8dac207b11663c2a0324f55f5038fdad');
    return res.json({
        message: 'News fetched successfully',
        data: newsData.data
    });
}


const publicFetchController = { fetchNews, fetchGitRepo, fetchGitRepoByUser };

export default publicFetchController;