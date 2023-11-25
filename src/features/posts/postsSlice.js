import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"; //firestore
import { db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// Async thunk for fetching a user's posts
// Async for not freezing whole app, user still perform other action when loading
// ProfileMidBody.jsx
export const fetchPostsByUser = createAsyncThunk(
  "posts/fetchPostsByUser", // name
  async (userId) => {
    try {
      // get from firestore
      const postsRef = collection(db, `users/${userId}/posts`); //db = database from firestore (firebase.js)

      const querySnapshot = await getDocs(postsRef);
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return docs; //output 'docs' to action.payload
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

// NewPostModal.jsx
export const savePost = createAsyncThunk(
  "posts/savePost",
  async ({ userId, postContent, file }) => {
    // create post from firestore
    try {
      // storage
      let imageUrl = "";

      if (file !== null) {
        const imageRef = ref(storage, `posts/${file.name}`); //where to store
        const response = await uploadBytes(imageRef, file); //receive uploaded file data
        imageUrl = await getDownloadURL(response.ref); //receive uploaded file url
      }

      // firestore
      const postsRef = collection(db, `users/${userId}/posts`);
      console.log(`users/${userId}/posts`);
      console.log("userId", userId);

      //Since no postId is give, Firestore will generate a unique ID for this document
      const newPostRef = doc(postsRef);
      console.log(postContent);

      // storage to imageUrl
      await setDoc(newPostRef, { content: postContent, likes: [], imageUrl });

      const newPost = await getDoc(newPostRef); //double confirm if exists

      //new post content
      const post = {
        id: newPost.id,
        ...newPost.data(),
      };

      return post;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost", // name
  async ({ userId, postId, newPostContent, newFile }) => {
    try {
      // upload the new file to the storage if it exists and get its URL
      let newImageUrl;
      if (newFile) {
        const imageRef = ref(storage, `posts/${newFile.name}`);
        const response = await uploadBytes(imageRef, newFile);
        newImageUrl = await getDownloadURL(response.ref);
      }
      // reference to the existing post
      const postRef = doc(db, `users/${userId}/posts/${postId}`);
      // get the current post data
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const postData = postSnap.data();
        //update the post content and the image URL
        const updatedData = {
          ...postData,
          content: newPostContent || postData.content,
          imageUrl: newImageUrl || postData.imageUrl,
        };
        //update the existing document in Firestore
        await updateDoc(postRef, updatedData);
        //return the post with updated data
        const updatedPost = { id: postId, ...updatedData };
        return updatedPost;
      } else {
        throw new Error("Post does not exist");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost", // name
  async ({ userId, postId }) => {
    try {
      // refer from firestore
      const postRef = doc(db, `users/${userId}/posts/${postId}`); //db = database from firestore (firebase.js)
      // delete the post
      await deleteDoc(postRef);
      // return the id of the deleted post
      return postId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async ({ userId, postId }) => {
    try {
      const postRef = doc(db, `users/${userId}/posts/${postId}`); //doc(firestore, path)

      const docSnap = await getDoc(postRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();
        const likes = [...postData.likes, userId];
        //userId = 'USER1'
        //postData.likes = ['HAHA1', 'JJ1']
        // ... ^^^ = 'HAHA','JJ1'
        //likes = ['HAHA1', 'JJ1', 'USER1]

        await setDoc(postRef, { ...postData, likes }); //setDoc(path, data)
      }

      return { userId, postId };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const removeLikeFromPost = createAsyncThunk(
  "posts/removeLikeFromPost",
  async ({ userId, postId }) => {
    try {
      const postRef = doc(db, `users/${userId}/posts/${postId}`);

      const docSnap = await getDoc(postRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();
        const likes = postData.likes.filter((id) => id !== userId);

        await setDoc(postRef, { ...postData, likes });
      }

      return { userId, postId };
    } catch (error) {
      console.error(error);
      throw error;
    }
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
    builder

      // get posts by userId
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        //fulfilled(one of a async requestStatus, have pending, rejected), means perform action after async fetchPostsByUser finished
        state.posts = action.payload;
        state.loading = false; // stop loading for frontend UX
      })

      // create new post
      .addCase(savePost.fulfilled, (state, action) => {
        state.posts = [action.payload, ...state.posts];

        // action.payload = [{id: 1, "title": "Post title", "content": "post content", user_id: 5}]
        // ...state.posts = [{id: 2, "title": "Post haha", "content": "post hah", user_id: 3}]
        //  [a,b]
        // [action.payload, ...state.posts] = [{id: 1, "title": "Post title", "content": "post content", user_id: 5}, {id: 2, "title": "Post haha", "content": "post hah", user_id: 3}]
      })

      .addCase(updatePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        //find and update the post in the state
        const postIndex = state.posts.findIndex(
          (post) => post.id === updatedPost.id
        );
        if (postIndex !== -1) {
          state.posts[postIndex] = updatedPost;
        }
      })

      .addCase(deletePost.fulfilled, (state, action) => {
        const deletedPostId = action.payload;
        //filter out the deleted post from state
        state.posts = state.posts.filter((post) => post.id !== deletedPostId);
      })

      // like post
      .addCase(likePost.fulfilled, (state, action) => {
        const { userId, postId } = action.payload;

        const postIndex = state.posts.findIndex((post) => post.id === postId);

        if (postIndex !== -1) {
          state.post[postIndex].likes.push(userId);
        }
      })

      //remove like post
      .addCase(removeLikeFromPost.fulfilled, (state, action) => {
        const { userId, postId } = action.payload;

        const postIndex = state.posts.findIndex((post) => post.id === postId);

        if (postIndex !== -1) {
          state.post[postIndex].likes = state.posts[postIndex].likes.filter(
            (id) => id !== userId
          );
        }
      });
  },
});

export default postsSlice.reducer;
