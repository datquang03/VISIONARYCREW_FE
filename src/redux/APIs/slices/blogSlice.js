import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest, postRequest, putRequest, deleteRequest } from "../../../services/httpMethods";
import { CustomToast } from "../../../components/Toast/CustomToast";

const initialState = {
  blogs: [],
  currentBlog: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  },
  isLoading: false,
  isError: false,
  message: "",
  // For blog creation/update
  isSubmitting: false,
  submitError: null,
  // For comments
  isCommentLoading: false,
  commentError: null,
};

export const getBlogs = createAsyncThunk(
  "blog/getBlogs",
  async ({ page = 1, limit = 10, search = "", tag = "", status = "published", doctorId = "" }, { rejectWithValue }) => {
    try {
      const response = await getRequest("/blogs", { page, limit, search, tag, status, doctorId });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Lỗi khi tải danh sách blog");
    }
  }
);

export const getBlogById = createAsyncThunk(
  "blog/getBlogById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getRequest(`/blogs/${id}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Lỗi khi tải thông tin blog");
    }
  }
);

export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postRequest("/blogs", formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Lỗi khi tạo blog");
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await putRequest(`/blogs/${id}`, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Lỗi khi cập nhật blog");
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteRequest(`/blogs/${id}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Lỗi khi xóa blog");
    }
  }
);

// Toggle like
export const toggleLike = createAsyncThunk(
  "blog/toggleLike",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequest(`/blogs/${id}/like`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi khi thích/bỏ thích blog");
    }
  }
);

// Add comment
export const addComment = createAsyncThunk(
  "blog/addComment",
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const response = await postRequest(`/blogs/${id}/comments`, { content });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi khi thêm bình luận");
    }
  }
);

// Update comment
export const updateComment = createAsyncThunk(
  "blog/updateComment",
  async ({ blogId, commentId, content }, { rejectWithValue }) => {
    try {
      const response = await putRequest(`/blogs/${blogId}/comments/${commentId}`, {
        content,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi khi cập nhật bình luận");
    }
  }
);

// Delete comment
export const deleteComment = createAsyncThunk(
  "blog/deleteComment",
  async ({ blogId, commentId }, { rejectWithValue }) => {
    try {
      const response = await deleteRequest(
        `/blogs/${blogId}/comments/${commentId}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi khi xóa bình luận");
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    resetBlogState: (state) => {
      state.currentBlog = null;
      state.isError = false;
      state.message = "";
      state.submitError = null;
      state.commentError = null;
    },
    clearSubmitError: (state) => {
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Blogs
      .addCase(getBlogs.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.data.blogs;
        state.pagination = action.payload.data.pagination;
        state.isError = false;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.blogs = [];
        CustomToast({ message: state.message, type: "error" });
      })

      // Get Blog by ID
      .addCase(getBlogById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBlog = action.payload.data;
        state.isError = false;
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        CustomToast({ message: state.message, type: "error" });
      })

      // Create Blog
      .addCase(createBlog.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.blogs.unshift(action.payload.data);
        state.submitError = null;
        CustomToast({ message: action.payload.message || "Blog đã được tạo thành công", type: "success" });
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload;
        CustomToast({ message: state.submitError, type: "error" });
      })

      // Update Blog
      .addCase(updateBlog.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.currentBlog = action.payload.data;
        state.blogs = state.blogs.map((blog) =>
          blog._id === action.payload.data._id ? action.payload.data : blog
        );
        state.submitError = null;
        CustomToast({ message: action.payload.message || "Blog đã được cập nhật thành công", type: "success" });
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload;
        CustomToast({ message: state.submitError, type: "error" });
      })

      // Delete Blog
      .addCase(deleteBlog.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.blogs = state.blogs.filter(
          (blog) => blog._id !== action.meta.arg
        );
        state.submitError = null;
        CustomToast({ message: action.payload.message || "Blog đã được xóa thành công", type: "success" });
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload;
        CustomToast({ message: state.submitError, type: "error" });
      });
  },
});

export const { resetBlogState, clearSubmitError } = blogSlice.actions;
export default blogSlice.reducer; 