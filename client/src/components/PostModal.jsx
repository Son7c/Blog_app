import { useEffect } from "react";
import {
    X,
    Sparkles,
    Languages,
    RotateCcw,
    Lock,
    Edit2,
    Trash2,
} from "lucide-react";

// Modal popup to display full blog post with AI features
// Props: post data, callback functions for actions, AI state
const PostModal = ({
    post,
    onClose,
    onEdit,
    onDelete,
    currentUser,
    summary,
    translated,
    isLoadingAI,
    showTranslate,
    onSummarize,
    onTranslate,
    onToggleTranslate,
    onShowOriginal,
}) => {
    if (!post) return null;

    // Listen for Escape key to close modal
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc); // Cleanup
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop: dark overlay behind modal */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content: the actual popup box */}
            <div
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl transform transition-all duration-300 animate-in fade-in zoom-in-95"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <CloseButton onClose={onClose} />

                <div className="py-8 px-4 sm:p-12">
                    <ModalHeader post={post} />

                    <AIToolbar
                        currentUser={currentUser}
                        isLoadingAI={isLoadingAI}
                        summary={summary}
                        translated={translated}
                        showTranslate={showTranslate}
                        onSummarize={onSummarize}
                        onToggleTranslate={onToggleTranslate}
                        onShowOriginal={onShowOriginal}
                        onTranslate={onTranslate}
                    />

                    <AISummary summary={summary} />

                    <PostContent post={post} translated={translated} />

                    <ActionButtons
                        post={post}
                        currentUser={currentUser}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </div>
            </div>
        </div>
    );
};

// --- Sub-Components ---
// Breaking down the modal into smaller, reusable pieces

const CloseButton = ({ onClose }) => (
    <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-all z-10 hover:cursor-pointer"
        aria-label="Close modal"
    >
        <X className="w-6 h-6" />
    </button>
);

// Shows post title and author info
const ModalHeader = ({ post }) => (
    <header className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-sans font-bold text-zinc-900 mb-6 leading-tight">
            {post.title}
        </h1>

        <div className="flex items-center gap-4">
            {/* Avatar: shows first letter of author's name */}
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-100 to-blue-50 flex items-center justify-center text-lg font-bold text-blue-600 ring-4 ring-white shadow-sm">
                {post.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
                <p className="font-medium text-zinc-900 text-lg font-domine">
                    {post.user?.name || "Unknown Author"}
                </p>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <time dateTime={post.createdAt}>
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </time>
                    <span>•</span>
                    <span>
                        {Math.ceil(post.content.length / 1000)} min read
                    </span>
                </div>
            </div>
        </div>
    </header>
);

// AI feature buttons: Summarize and Translate
// Conditional rendering: shows different buttons based on state
const AIToolbar = ({
    currentUser,
    isLoadingAI,
    summary,
    translated,
    showTranslate,
    onSummarize,
    onToggleTranslate,
    onShowOriginal,
    onTranslate,
}) => (
    <>
        <div className="flex flex-wrap items-center gap-3 mb-8 p-2 bg-zinc-50 rounded-2xl border border-zinc-100 w-fit">
            {/* Summarize Button */}
            <button
                onClick={onSummarize}
                disabled={isLoadingAI}
                className={`
          inline-flex items-center hover:cursor-pointer gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
          ${
              summary
                  ? "bg-blue-100 text-blue-700"
                  : "bg-white text-zinc-700 hover:bg-white hover:shadow-md hover:text-blue-600"
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
                title={!currentUser ? "Login required" : ""}
            >
                <Sparkles className="w-4 h-4" />
                {isLoadingAI ? "Thinking..." : "Summarize"}
                {!currentUser && <LockIcon />}
            </button>

            <div className="w-px h-6 bg-zinc-200 mx-1"></div>

            {/* Translate Button */}
            <button
                onClick={onToggleTranslate}
                className={`
          inline-flex items-center hover:cursor-pointer gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
          ${
              showTranslate || translated
                  ? "bg-purple-100 text-purple-700"
                  : "bg-white text-zinc-700 hover:bg-white hover:shadow-md hover:text-purple-600"
          }
        `}
                title={!currentUser ? "Login required" : ""}
            >
                <Languages className="w-4 h-4" />
                Translate
                {!currentUser && <LockIcon />}
            </button>

            {/* Reset Button */}
            {translated && (
                <button
                    onClick={onShowOriginal}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white text-zinc-700 hover:bg-zinc-100 transition-all"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                </button>
            )}
        </div>

        {/* Language Selection */}
        {showTranslate && (
            <div className="mb-8 animate-in slide-in-from-top-2 fade-in duration-200">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 ml-1">
                    Select Language
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {[
                        "Spanish",
                        "French",
                        "German",
                        "Hindi",
                        "Bengali",
                        "Japanese",
                    ].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => onTranslate(lang)}
                            disabled={isLoadingAI}
                            className="px-3 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-sm font-medium hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-all disabled:opacity-50 hover:cursor-pointer"
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            </div>
        )}
    </>
);

const LockIcon = () => <Lock className="w-3 h-3 text-zinc-400" />;

// Displays AI-generated summary if available
// Conditional rendering: only shows if summary exists
const AISummary = ({ summary }) => {
    if (!summary) return null;

    return (
        <div className="relative overflow-hidden bg-linear-to-br from-blue-50 via-indigo-50 to-white border border-blue-100 rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
            <div className="relative flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                        AI Summary
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px]">
                            Beta
                        </span>
                    </h3>
                    <p className="text-blue-900/80 leading-relaxed text-lg font-medium font-serif">
                        {summary}
                    </p>
                </div>
            </div>
        </div>
    );
};

// Main post content - shows translated version if available
const PostContent = ({ post, translated }) => (
    <div className="prose prose-lg max-w-none prose-headings:font-serif prose-p:text-zinc-700 prose-p:leading-relaxed prose-a:text-blue-600 hover:prose-a:text-blue-500">
        <div className="whitespace-pre-wrap text-lg font-domine leading-8 text-zinc-800">
            {translated?.content || post.content}
        </div>
    </div>
);

// Edit and Delete buttons - only shown to post author
// Conditional rendering: only shows if current user owns the post
const ActionButtons = ({ post, currentUser, onEdit, onDelete }) => {
    if (!currentUser || currentUser._id !== post.user?._id) return null;

    return (
        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-zinc-100">
            <button
                onClick={() => onEdit(post._id)}
                className="flex-1 inline-flex justify-center items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-zinc-800 transition-all hover:scale-[1.01] active:scale-[0.98] hover:cursor-pointer"
            >
                <Edit2 className="w-5 h-5" />
                Edit Story
            </button>
            <button
                onClick={() => onDelete(post._id)}
                className="flex-1 inline-flex justify-center items-center gap-2 bg-white text-red-600 border border-red-200 px-8 py-4 rounded-full font-medium hover:bg-red-50 hover:border-red-300 transition-all hover:scale-[1.01] active:scale-[0.98] hover:cursor-pointer"
            >
                <Trash2 className="w-5 h-5" />
                Delete Story
            </button>
        </div>
    );
};

export default PostModal;
