import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog, updateBlog, getBlogs, deleteBlog } from '../../../redux/APIs/slices/blogSlice';
import DashboardLayout from '../components/DashboardLayout';
import { FaEdit, FaTrash, FaPlus, FaRegHeart, FaRegComment, FaRegEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';

const DoctorBlog = () => {
  const dispatch = useDispatch();
  const { blogs, isLoading } = useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.authSlice);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: '',
    images: []
  });

  useEffect(() => {
    dispatch(getBlogs({ 
      page: 1, 
      limit: 10,
      doctorId: user?._id 
    }));
  }, [dispatch, user?._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditorChange = (content, editor) => {
    setFormData(prev => ({
      ...prev,
      content: content
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'images') {
        formData.images.forEach(image => {
          data.append('images', image);
        });
      } else if (key === 'tags') {
        data.append('tags', formData.tags.split(',').map(tag => tag.trim()));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      if (editingBlog) {
        await dispatch(updateBlog({ id: editingBlog._id, formData: data })).unwrap();
        toast.success('Blog đã được cập nhật thành công!');
      } else {
        await dispatch(createBlog(data)).unwrap();
        toast.success('Blog đã được tạo thành công!');
      }
      setShowModal(false);
      setEditingBlog(null);
      setFormData({
        title: '',
        description: '',
        content: '',
        tags: '',
        images: []
      });
      dispatch(getBlogs({ page: 1, limit: 10, doctorId: user?._id }));
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      content: blog.content,
      tags: blog.tags.join(', '),
      images: []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa blog này?')) {
      try {
        await dispatch(deleteBlog(id)).unwrap();
        toast.success('Blog đã được xóa thành công!');
        dispatch(getBlogs({ page: 1, limit: 10, doctorId: user?._id }));
      } catch (error) {
        toast.error(error.message || 'Có lỗi xảy ra khi xóa blog');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Blog</h1>
            <button
              onClick={() => {
                setEditingBlog(null);
                setFormData({
                  title: '',
                  description: '',
                  content: '',
                  tags: '',
                  images: []
                });
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              <FaPlus /> Tạo Blog Mới
            </button>
          </div>
          <p className="text-gray-600">
            Quản lý và chia sẻ kiến thức y tế của bạn thông qua các bài viết chuyên môn
          </p>
        </div>

        {/* Blog List Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Danh sách bài viết của bạn</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : blogs?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Bạn chưa có bài viết nào. Hãy bắt đầu chia sẻ kiến thức của bạn!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs?.map((blog) => (
                  <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                    {blog.images?.[0] && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={blog.images[0]}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {blog.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">{blog.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{blog.description}</p>
                      
                      <div className="flex gap-2 flex-wrap mb-4">
                        {blog.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <FaRegHeart /> {blog.likes?.length || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaRegComment /> {blog.comments?.length || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaRegEye /> {blog.views || 0}
                          </span>
                        </div>
                        <span>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="text-blue-600 hover:text-blue-800 p-2"
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <FaTrash size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingBlog ? 'Chỉnh Sửa Blog' : 'Tạo Blog Mới'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nội dung
                  </label>
                  <Editor
                    apiKey="your-tinymce-api-key"
                    value={formData.content}
                    init={{
                      height: 400,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                    onEditorChange={handleEditorChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (phân cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ví dụ: sức khỏe, dinh dưỡng, tập luyện"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh (tối đa 3 ảnh)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang xử lý...' : editingBlog ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorBlog;
