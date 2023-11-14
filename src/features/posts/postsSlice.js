import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "https://twitter-api-zeph-goh.sigma-school-full-stack.repl.co";

// Async thunk for fetching a user's posts
// Async for not freezing whole app, user still perform other action when loading
// ProfileMidBody.jsx
export const fetchPostsByUser = createAsyncThunk(
  "posts/fetchPostsByUser", // name
  async (userId) => {
    const response = await fetch(`${BASE_URL}/posts/user/${userId}`);
    return response.json(); //return posts from api
  }
);

// NewPostModal.jsx
export const savePost = createAsyncThunk(
  "posts/savePost",
  async (postContent) => {
    const token = localStorage.getItem("authToken");
    const decodeToken = jwtDecode(token);
    const userId = decodeToken.id;

    const data = {
      title: "Post Title",
      content: postContent,
      user_id: userId,
    };

    const response = await axios.post(`${BASE_URL}/posts`, data); //axios.post(URL, data)
    return response.data;
  }
);

// ProfilePostCard.jsx
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId) => {
    const response = await axios.delete(`${BASE_URL}/posts/${postId}`);
    return { postId, ...response.data };
  }
);

//ProfileRightSidebar.jsx
export const searchUser = createAsyncThunk(
  "posts/searchUser",
  async (searchTerm) => {
    const response = await fetch(`${BASE_URL}/search?q=${searchTerm}`);
    return response.json();
  }
);

//CommentPostModal.jsx
export const saveComment = createAsyncThunk(
  "posts/saveComment",
  async ({ postId, postComment }) => {
    const token = localStorage.getItem("authToken");
    const decodeToken = jwtDecode(token);
    const userId = decodeToken.id;

    const data = {
      post_id: postId,
      user_id: userId,
      comment_text: postComment,
    };

    const response = await axios.post(`${BASE_URL}/comments/${postId}`, data); //axios.post(URL, data)
    return response.data;
  }
);

//get comments by postId
export const fetchCommentsByPostId = createAsyncThunk(
  "posts/fetchCommentsByPostId",
  async (postId) => {
    const response = await fetch(`${BASE_URL}/comments/${postId}`);
    const comments = await response.json();
    return { postId, comments };
  }
);

//delete a comment
export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async (commentId) => {
    const response = await axios.delete(`${BASE_URL}/comments/${commentId}`);
    return { commentId, ...response.data };
  }
);

// get username by userId
export const usernameByUserId = createAsyncThunk(
  "posts/usernameByUserId",
  async (userId) => {
    const response = await axios.get(`${BASE_URL}/users/${userId}`);
    return response.data[0].username;
  }
);

//Slice
const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: true,
    searchResults: [],
    comments: [],
    username: "",
  }, //loading for frontend UX
  reducers: {}, // REDUCERS for SYNC
  // EXTRAreducers FOR Async
  extraReducers: (builder) => {
    // get posts by userId
    builder.addCase(fetchPostsByUser.fulfilled, (state, action) => {
      //fulfilled(one of a async requestStatus, have pending, rejected), means perform action after async fetchPostsByUser finished
      state.posts = action.payload;
      state.loading = false; // stop loading for frontend UX
    });

    // create new post
    builder.addCase(savePost.fulfilled, (state, action) => {
      state.posts = [action.payload, ...state.posts];

      // action.payload = [{id: 1, "title": "Post title", "content": "post content", user_id: 5}]
      // ...state.posts = [{id: 2, "title": "Post haha", "content": "post hah", user_id: 3}]
      //  [a,b]
      // [action.payload, ...state.posts] = [{id: 1, "title": "Post title", "content": "post content", user_id: 5}, {id: 2, "title": "Post haha", "content": "post hah", user_id: 3}]
    });

    // delete post
    builder.addCase(deletePost.fulfilled, (state, action) => {
      const { postId } = action.payload;
      state.posts = state.posts.filter((post) => post.id !== postId);
    });

    // get username for search bar
    builder.addCase(searchUser.fulfilled, (state, action) => {
      state.searchResults = action.payload;
    });

    // get comments by postId
    builder.addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
      state.comments[action.payload.postId] = action.payload.comments;
    });

    // create new comment for a post
    builder.addCase(saveComment.fulfilled, (state, action) => {
      const { postId } = action.payload;
      if (state.comments[postId]) {
        state.comments[postId] = [action.payload, ...state.comments[postId]];
      }
    });

    //delete a comment
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      const { commentId, postId } = action.payload;
      if (state.comments[postId]) {
        state.comments[postId] = state.comments[postId].filter(
          (comment) => comment.id !== commentId
        );
      }
    });

    // get username by userId
    builder.addCase(usernameByUserId.fulfilled, (state, action) => {
      state.username = action.payload;
    });
  },
});

export default postsSlice.reducer;
