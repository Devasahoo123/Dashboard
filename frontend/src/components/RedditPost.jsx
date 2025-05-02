// src/components/RedditPost.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function RedditPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/feed/reddit/post/${id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setPost(res.data);
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div>Loading post...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-2">
        <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
          Reddit
        </span>
        <span className="ml-2 text-sm text-gray-500">
          Posted by u/{post.author}
        </span>
      </div>
      
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      
      {post.text && (
        <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: post.text }} />
      )}
      
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span>⬆️ {post.upvotes} upvotes</span>
        <span className="mx-2">•</span>
        <span>{post.created.toLocaleDateString()}</span>
      </div>
      
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 hover:text-indigo-800 inline-block mb-6"
      >
        View on Reddit
      </a>
      
      <h3 className="font-medium mb-2">Top Comments</h3>
      <div className="space-y-3">
        {post.comments.map((comment, i) => (
          <div key={i} className="border-l-2 border-gray-200 pl-3">
            <p className="text-sm font-medium">u/{comment.author}</p>
            <p className="text-sm">{comment.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}