
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { githubApi } from '../services/githubApi';
import { Commit } from '../types';
import { ServerCrash, GitCommit } from 'lucide-react';
import { formatRelativeTime } from '../utils/formatters';
import LoadingSpinner from './common/LoadingSpinner';

interface CommitListProps {
  owner: string;
  repo: string;
}

const CommitList: React.FC<CommitListProps> = ({ owner, repo }) => {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCommits = useCallback(() => {
    setLoading(true);
    githubApi.getCommits(owner, repo, page)
      .then(response => {
        setCommits(prev => page === 1 ? response.data : [...prev, ...response.data]);
        if (response.data.length < 20) {
          setHasMore(false);
        }
      })
      .catch((err) => {
        setError('Failed to fetch commits.');
      })
      .finally(() => setLoading(false));
  }, [owner, repo, page]);

  useEffect(() => {
    setCommits([]);
    setPage(1);
    setHasMore(true);
    fetchCommits();
  }, [owner, repo]);
  
  useEffect(() => {
    if(page > 1) fetchCommits();
  }, [page]);

  if (error) {
    return <div className="text-center py-10 text-red-500 flex flex-col items-center animate-fade-in"><ServerCrash size={48} className="mb-4" /><p>{error}</p></div>;
  }
  
  if (commits.length === 0 && loading) {
    return <LoadingSpinner size={40} />
  }

  if (commits.length === 0 && !loading) {
    return <div className="text-center p-8 text-gray-500 animate-fade-in">No commits found.</div>
  }

  return (
    <div className="relative animate-fade-in">
       <div className="absolute left-5 top-0 h-full w-0.5 bg-base-200 dark:bg-base-800" aria-hidden="true"></div>
      <ul className="space-y-8">
        {commits.map((commit) => (
          <li key={commit.sha} className="relative pl-12 group transition-all duration-200">
            <div className="absolute left-5 top-2 -translate-x-1/2 w-4 h-4 bg-base-200 dark:bg-base-800 rounded-full flex items-center justify-center transition-colors group-hover:bg-primary/20">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
            <div className="flex items-start space-x-4">
               {commit.author?.avatar_url ? (
                <Link to={`/profile/${commit.author.login}`} className="flex-shrink-0 transition-transform hover:scale-110">
                    <img src={commit.author.avatar_url} alt={commit.author.login} className="w-8 h-8 rounded-full" />
                </Link>
              ) : (
                <div className="w-8 h-8 rounded-full bg-base-200 dark:bg-base-700 flex-shrink-0"></div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 dark:text-base-100 break-words group-hover:text-primary transition-colors">{commit.commit.message.split('\n')[0]}</p>
                <div className="text-xs text-gray-500 dark:text-base-400 mt-1 flex items-center">
                  {commit.author?.login ? (
                    <Link to={`/profile/${commit.author.login}`} className="font-semibold hover:underline transition-colors">{commit.commit.author.name}</Link>
                  ) : (
                    <span className="font-semibold">{commit.commit.author.name}</span>
                  )}
                  <span className="mx-1.5">&bull;</span>
                  <span>{formatRelativeTime(commit.commit.author.date)}</span>
                  <span className="mx-1.5">&bull;</span>
                  <span className="font-mono text-primary dark:text-primary-light">{commit.sha.substring(0, 7)}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      {loading && page > 1 && <div className="flex justify-center py-4"><LoadingSpinner size={32} /></div>}
      
      {hasMore && !loading && commits.length > 0 && (
        <div className="text-center mt-8">
          <button onClick={() => setPage(p => p + 1)} className="px-5 py-2 text-sm border border-base-300 dark:border-base-700 rounded-lg hover:bg-base-100 dark:hover:bg-base-800 transition-all duration-200 font-semibold">
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default CommitList;
