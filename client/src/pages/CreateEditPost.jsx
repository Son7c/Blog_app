import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import postService from "../services/postService";

/**
 * CreateEditPost Page - Form for creating new posts or editing existing ones
 *
 * KEY CONCEPTS:
 * - Controlled inputs: form values stored in state
 * - useParams: gets post ID from URL (/edit-post/:id)
 * - Conditional logic: same component for create AND edit
 * - Form handling: onChange updates state, onSubmit saves data
 * - Object spread: {...prevState, [name]: value} updates one field
 */

const CreateEditPost = () => {
    // Form state - controlled inputs
    const [formData, setFormData] = useState({
        title: "",
        content: "",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { title, content } = formData; // Destructure for easier access
    const { id } = useParams(); // Get post ID from URL (undefined if creating new)
    const navigate = useNavigate();

    const reset = () => {
        setIsSuccess(false);
    };

    // Load existing post data if editing (when id exists in URL)
    useEffect(() => {
        reset();
        if (id) {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                toast.error("Please login to edit posts");
                navigate("/login");
                return;
            }
            const currentUser = JSON.parse(storedUser);

            const storedPosts = localStorage.getItem("posts");
            if (storedPosts) {
                const parsedPosts = JSON.parse(storedPosts);
                const post = parsedPosts.find((p) => p._id === id); // Find post by ID

                if (post) {
                    // Authorization: verify ownership before allowing edit
                    const isOwner =
                        post.user._id === currentUser._id ||
                        post.user.email === currentUser.email;

                    if (!isOwner) {
                        toast.error("You can only edit your own posts!");
                        navigate("/");
                        return;
                    }

                    // Pre-fill form with existing data
                    setFormData({
                        title: post.title,
                        content: post.content,
                    });
                } else {
                    toast.error("Post not found");
                    navigate("/");
                }
            }
        }
        return () => reset(); // Cleanup
    }, [id, navigate]); // Re-run if id changes

    useEffect(() => {
        if (isSuccess && isSubmitted) {
            toast.success(
                id
                    ? "Story updated successfully!"
                    : "Story published successfully!",
            );
            reset();
            navigate("/");
        }
    }, [isSuccess, isSubmitted, id, navigate]);

    // Handle input changes - updates state as user types
    // Spread operator (...) keeps other fields, updates only the changed one
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState, // Keep existing values
            [e.target.name]: e.target.value, // Update this field
        }));
    };

    // Form submit handler - creates new post or updates existing one
    const onSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setIsLoading(true);

        try {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                toast.error("Please login to create a post");
                navigate("/login");
                return;
            }
            const user = JSON.parse(storedUser);

            if (id) {
                // EDIT MODE (Note: Your backend updatePost is currently empty, so this might not work yet)
                await postService.updatePost(id, {
                    title,
                    content
                });
            } else {
                // CREATE MODE
                // We must send 'userId' because your backend controller expects it
                await postService.createPost({
                    title,
                    content,
                    userId: user._id || user.id 
                });
            }

            setTimeout(() => {
                setIsLoading(false);
                setIsSuccess(true);
            }, 500);
        } catch (error) {
            console.error("Error saving post:", error);
            setIsLoading(false);
            // Show a specific error message if available
            toast.error(error.response?.data?.message || "Failed to save post");
        }
    };

    if (isLoading) {
        return (
            <LoadingSpinner
                text={id ? "Saving changes..." : "Publishing story..."}
            />
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold text-zinc-900 mb-4">
                        {id ? "Edit Story" : "Tell Your Story"}
                    </h1>
                    <p className="text-xl text-zinc-600">
                        {id
                            ? "Refine your thoughts and update your readers."
                            : "Share your ideas, knowledge, and creativity with the world."}
                    </p>
                </div>

                <form
                    onSubmit={onSubmit}
                    className="bg-white rounded-3xl shadow-xl shadow-zinc-100/50 border border-zinc-100 p-8 sm:p-12 space-y-8"
                >
                    <div className="space-y-2">
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-zinc-700 uppercase tracking-wider"
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={title}
                            onChange={onChange}
                            required
                            className="w-full px-0 py-4 border-b-2 border-zinc-100 text-3xl sm:text-4xl font-sans font-bold text-zinc-900 focus:border-black focus:outline-none transition-colors placeholder-zinc-300"
                            placeholder="Enter a captivating title..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="content"
                            className="block text-sm font-medium text-zinc-700 uppercase tracking-wider"
                        >
                            Content
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            rows={15}
                            value={content}
                            onChange={onChange}
                            required
                            className="w-full px-6 py-6 bg-zinc-50 rounded-2xl border-0 text-l font-domine text-zinc-800 leading-relaxed focus:ring-2 focus:ring-black/5 transition-all resize-y placeholder-zinc-400"
                            placeholder="Start writing your story here..."
                        />
                        <div className="flex justify-end">
                            <p className="text-sm text-zinc-400 font-medium">
                                {content.length} characters
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-zinc-100">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="w-full sm:w-auto btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto btn-primary ml-auto"
                        >
                            {id ? "Save Changes" : "Publish Story"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEditPost;
