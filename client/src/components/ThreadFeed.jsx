import { useState, useEffect } from "react";
import CommentItem from "./CommentsContainer";
import AuthBar from "./Auth";
import { getUser } from "../auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CommentList() {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(getUser());

  // Fetch comments from backend when component loads
  useEffect(() => {
    loadComments();
  }, []);

  // Listen for user changes (when they sign in/out)
  useEffect(() => {
    const checkUser = () => {
      setUser(getUser());
    };
    const interval = setInterval(checkUser, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fixed handleLike function
  async function handleLike(commentId) {
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/api/comments/toggle-like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          commentId: commentId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      // Reload comments to get updated data
      loadComments();
    } catch (error) {
      console.error('Like failed:', error);
    }
  }

  async function loadComments() {
    try {
      const response = await fetch(`${API_URL}/api/comments`);
      if (response.ok) {
        const data = await response.json();
        const tree = buildTree(data);
        setComments(tree);
      }
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  }

  // Build nested comment tree from flat array
  function buildTree(flatComments) {
    const map = {};
    const roots = [];

    flatComments.forEach((comment) => {
      map[comment.id] = { ...comment, children: [] };
    });

    flatComments.forEach((comment) => {
      if (comment.parentId) {
        if (map[comment.parentId]) {
          map[comment.parentId].children.push(map[comment.id]);
        } else {
          roots.push(map[comment.id]);
        }
      } else {
        roots.push(map[comment.id]);
      }
    });

    return roots;
  }

  async function handlePost() {
    if (!text.trim() || !user) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          author: user.displayName,
          parentId: null,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments((prev) => [...prev, { ...newComment, children: [] }]);
        setText("");
      } else {
        alert("Failed to post comment");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReply(parentId, replyText) {
    if (!replyText.trim() || !user) return;

    try {
      const response = await fetch(`${API_URL}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: replyText.trim(),
          author: user.displayName,
          parentId: parentId,
        }),
      });

      if (response.ok) {
        const newReply = await response.json();

        setComments((prev) => {
          const addReply = (items) => {
            return items.map((item) => {
              if (item.id === parentId) {
                return {
                  ...item,
                  children: [
                    ...(item.children || []),
                    { ...newReply, children: [] },
                  ],
                };
              }
              return { ...item, children: addReply(item.children || []) };
            });
          };
          return addReply(prev);
        });
      }
    } catch (error) {
      console.error("Failed to post reply:", error);
      alert("Failed to post reply. Please try again.");
    }
  }

  return (
    <section className="mx-auto max-w-3xl p-4 sm:p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Thoughts</h2>
          <p className="text-sm text-neutral-600">
            Share your take and reply to others.
          </p>
        </div>
        <AuthBar />
      </header>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={user ? "Add a comment" : "Please sign in to comment"}
            rows={3}
            disabled={!user || loading}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 disabled:bg-neutral-100 disabled:cursor-not-allowed"
          />
          <div className="flex justify-end">
            <button
              onClick={handlePost}
              disabled={!text.trim() || !user || loading}
              className="px-4 py-2 rounded-md bg-neutral-900 text-white font-medium hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
          {!user && (
            <p className="text-xs text-neutral-600">
              Sign in with Google to post comments
            </p>
          )}
        </div>
      </div>

      {/* list */}
      <div className="mt-6">
        {comments.length === 0 ? (
          <p className="text-sm text-neutral-600">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                node={comment}
                onReply={handleReply}
                onLike={handleLike}
                user={user}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
