import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const createPost = async () => {
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        newPost
      );
      setPosts([...posts, response.data]);
      setNewPost({ title: "", body: "" });
      setMessage("Post created successfully.");
    } catch (error) {
      console.error("Error creating post:", error);
      setMessage("Failed to create post. Please try again.");
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(
        `https://jsonplaceholder.typicode.com/posts/${postId}`
      );
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
      setMessage("Post deleted successfully.");
    } catch (error) {
      console.error("Error deleting post:", error);
      setMessage("Failed to delete post. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h1>Posts</h1>

      {/* Message Display */}
      {message && (
        <div className="floating-alert">
          <div className="alert alert-info" role="alert">
            {message}
          </div>
        </div>
      )}
      {/* Create Post Form */}
      <form className="mb-4">
        <div className="form-group">
          <label htmlFor="postTitle">Title</label>
          <input
            type="text"
            className="form-control"
            id="postTitle"
            name="title"
            value={newPost.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="postBody">Body</label>
          <textarea
            className="form-control"
            id="postBody"
            name="body"
            rows="3"
            value={newPost.body}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <button
          type="button"
          className="btn btn-primary mr-2"
          onClick={createPost}
        >
          Create Post
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setNewPost({ title: "", body: "" })}
        >
          Clear
        </button>
      </form>

      {/* Posts List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-group">
          {posts.map((post) => (
            <li className="list-group-item" key={post.id}>
              <h5>{post.title}</h5>
              <p>{post.body}</p>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => deletePost(post.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
