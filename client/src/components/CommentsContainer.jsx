import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

export default function CommentItem({ node, depth = 0, onReply, onLike, user }) {
  const [showReply, setShowReply] = useState(false);
  const [text, setText] = useState("");
  const [liking, setLiking] = useState(false);
  const [visibleReplies, setVisibleReplies] = useState(0);
  const initials = node.author[0]?.toUpperCase() || "A";

  // Number of replies to reveal at a time
  const INITIAL_VISIBLE_REPLIES = 1;
  const LOAD_STEP = 2;

  useEffect(() => {
    const totalReplies = node.children?.length ?? 0;
    if (totalReplies === 0) {
      setVisibleReplies(0);
    } else {
      setVisibleReplies(Math.min(totalReplies, INITIAL_VISIBLE_REPLIES));
    }
  }, [node.children?.length]);

  async function handleLikeClick() {
    if (!user) return; 
    setLiking(true);
    try {
      await onLike(node.id);
    } catch (err) {
      console.error("Like failed:", err);
    } finally {
      setLiking(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onReply(node.id, text);
    setText("");
    setShowReply(false);
  }

  // Check if current user liked this comment
  const isLiked = node.likedBy?.some(like => like.userId === user?.id);
  const totalReplies = node.children?.length ?? 0;
  const remainingReplies = Math.max(0, totalReplies - visibleReplies);
  const visibleChildren = totalReplies > 0 ? node.children.slice(0, visibleReplies) : [];

  return (
    <div className="relative pl-6 sm:pl-10">
      {/* rail */}
      {depth > 0 && (
        <div className="absolute left-2 sm:left-4 top-0 bottom-0 w-px bg-neutral-200" />
      )}

      <div className="flex items-start gap-3">
        {/* avatar */}
        <div className="shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white grid place-content-center font-semibold shadow-sm">
          {initials}
        </div>
        <div className="flex-1 rounded-lg border border-neutral-200 bg-white/80 backdrop-blur p-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <span className="font-semibold text-neutral-800">
              {node.author}
            </span>
            <span>•</span>
            <time className="tabular-nums" dateTime={node.timestamp}>
              {formatDistanceToNow(new Date(node.timestamp), { addSuffix: true })}
            </time>
          </div>
          <p className="mt-1 text-neutral-800 leading-relaxed">{node.text}</p>
          <div className="mt-2 flex items-center gap-4 text-sm">
            <button
              className={`${isLiked ? "text-blue-600" : "text-gray-400"} hover:text-blue-700 font-medium`}
              onClick={handleLikeClick}
              disabled={liking}
              aria-pressed={isLiked}
            >
              ▲ {node.likes ?? 0}
            </button>
            <button
              className="text-neutral-600 hover:text-neutral-800"
              onClick={() => setShowReply((v) => !v)}
            >
              Reply
            </button>
          </div>

          {showReply && (
            <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a reply..."
                rows={3}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                >
                  Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowReply(false)}
                  className="px-3 py-1.5 rounded-md border text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* children */}
      {totalReplies > 0 && (
        <div className="mt-3 space-y-3">
          {visibleChildren.map((child) => (
            <CommentItem
              key={child.id}
              node={child}
              depth={depth + 1}
              onReply={onReply}
              onLike={onLike}
              user={user}
            />
          ))}
          {remainingReplies > 0 && (
            <button
              type="button"
              className="ml-12 text-sm font-medium text-neutral-600 hover:text-neutral-900"
              onClick={() =>
                setVisibleReplies((current) =>
                  Math.min(totalReplies, current + LOAD_STEP)
                )
              }
            >
              + {remainingReplies} more repl{remainingReplies === 1 ? "y" : "ies"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
