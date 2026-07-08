import React, { useState, useEffect } from "react";
import { MessageSquare, Heart, Send, Sparkles, Plus, Loader2, Check } from "lucide-react";
import { ForumPost } from "../types";

interface ForumPageProps {
  currentUser: { name: string; avatar: string; role: string };
}

export default function ForumPage({ currentUser }: ForumPageProps) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create post state
  const [newContent, setNewContent] = useState("");
  const [progressGrams, setProgressGrams] = useState("");
  const [tipInput, setTipInput] = useState("");
  const [addedTips, setAddedTips] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/forum");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: currentUser.name,
          avatar: currentUser.avatar,
          role: currentUser.role,
          content: newContent,
          tips: addedTips,
          progressGrams: Number(progressGrams) || 0
        }),
      });

      if (res.ok) {
        const newPost = await res.json();
        setPosts([newPost, ...posts]);
        setNewContent("");
        setProgressGrams("");
        setAddedTips([]);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2500);
      }
    } catch (err) {
      console.error("Error posting:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikePost = async (id: string) => {
    try {
      const res = await fetch(`/api/forum/${id}/like`, { method: "POST" });
      if (res.ok) {
        const updatedPost = await res.json();
        setPosts(posts.map((p) => (p.id === id ? updatedPost : p)));
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const addTipTag = () => {
    if (tipInput.trim() && addedTips.length < 5) {
      setAddedTips([...addedTips, tipInput.trim()]);
      setTipInput("");
    }
  };

  const removeTipTag = (idx: number) => {
    setAddedTips(addedTips.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8" id="forum-view">
      {/* Page Title Banner */}
      <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-600 p-8 rounded-3xl text-white shadow-lg text-center md:text-left">
        <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-2">
          🗣️ Community Sugar-Free Board
        </h1>
        <p className="text-white/90 max-w-2xl text-base md:text-lg">
          Share your sugar reductions, active lifestyle tips, and dietary wins. Supporting each other helps us stay resilient against NCDs!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Create Post Form */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-6 space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentUser.avatar}</span>
              <div>
                <h3 className="font-display font-bold text-lg text-gray-800">
                  Share Your Progress!
                </h3>
                <span className="text-xs text-gray-400 font-bold uppercase">{currentUser.role}</span>
              </div>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* Content text */}
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">What did you achieve today?</label>
                <textarea
                  placeholder="I avoided drinking juice, and felt great! Or share a useful nutrition tip..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  rows={4}
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-emerald-400 focus:outline-none text-sm transition-colors font-medium text-gray-700"
                ></textarea>
              </div>

              {/* Progress Sugar Reduction Grams */}
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Estimated Sugar Reduction (Optional - Grams)</label>
                <input
                  type="number"
                  placeholder="E.g., 15 (if you skipped a soda)"
                  value={progressGrams}
                  onChange={(e) => setProgressGrams(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border-2 border-gray-100 focus:border-emerald-400 focus:outline-none text-sm font-semibold"
                />
              </div>

              {/* Added Tips Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 block">Add Tip Tags (Max 5)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="E.g., Read labels carefully"
                    value={tipInput}
                    onChange={(e) => setTipInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTipTag();
                      }
                    }}
                    className="flex-grow p-3 rounded-2xl border-2 border-gray-100 text-xs focus:outline-none focus:border-emerald-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={addTipTag}
                    className="p-3 bg-slate-900 hover:bg-emerald-500 text-white rounded-xl cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {addedTips.map((tip, idx) => (
                    <span 
                      key={idx} 
                      onClick={() => removeTipTag(idx)}
                      className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-100 cursor-pointer hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      💡 {tip} ×
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !newContent.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-2xl transition-all duration-200 disabled:bg-gray-150 flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Broadcasting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Share Community Post
                  </>
                )}
              </button>

              {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold p-3 rounded-xl flex items-center justify-center gap-1 text-xs animate-bounce">
                  <Check className="w-4 h-4" /> Success! Post is live on the board.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right Side: Community Feed */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-display font-bold text-2xl text-gray-800">
            Real-Time Community Updates
          </h2>

          {loading ? (
            <div className="text-center p-12 bg-white rounded-3xl border border-gray-100">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-sm">Pulling posts from server database...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center p-12 bg-slate-50 border-4 border-dashed border-gray-200 rounded-3xl">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No posts shared yet. Be the first to break the ice!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div 
                  key={post.id}
                  className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm space-y-4 hover:border-emerald-100 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl bg-gray-50 p-1.5 rounded-2xl block">{post.avatar}</span>
                      <div>
                        <h4 className="font-display font-bold text-gray-800 leading-tight">{post.author}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {post.role}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sugar level saving badge */}
                    {post.progressGrams > 0 && (
                      <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-full border border-emerald-100 animate-pulse">
                        🛡️ Reduced {post.progressGrams}g Added Sugar!
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed font-medium">
                    {post.content}
                  </p>

                  {/* Attached Tips list */}
                  {post.tips && post.tips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tips.map((tip, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full">
                          💡 {tip}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions (Like) */}
                  <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 font-bold text-xs cursor-pointer transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{post.likes} Hearts</span>
                    </button>
                    
                    <span className="text-[10px] text-gray-400 font-medium">
                      Published globally
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
