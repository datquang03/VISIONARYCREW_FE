import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getBlogs } from '../../../redux/APIs/slices/blogSlice';
import { FaRegHeart, FaRegComment, FaRegEye, FaArrowRight } from 'react-icons/fa';

const BlogList = ({ limit = 6, showViewAll = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, isLoading, pagination } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(getBlogs({ 
      page: 1,
      limit,
      status: 'published',
      search: '',
      tag: '' 
    }));
  }, [dispatch, limit]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(limit)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-4 animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Chưa có bài viết nào
          </h2>
          <p className="text-gray-600">
            Các bài viết sẽ sớm được cập nhật. Vui lòng quay lại sau!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Bài Viết Nổi Bật
          </h2>
          <p className="text-gray-600 text-lg">
            Khám phá những kiến thức y tế hữu ích từ đội ngũ bác sĩ chuyên môn
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              variants={item}
              className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={blog.images[0] || '/images/default-blog.jpg'}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center mb-4 space-x-2">
                  <img
                    src={blog.doctorId?.avatar || '/images/default-avatar.jpg'}
                    alt={blog.doctorId?.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {blog.doctorId?.fullName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {blog.description}
                </p>

                {/* Stats & Read More */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-gray-500 text-sm">
                    <div className="flex items-center">
                      <FaRegHeart className="mr-1" />
                      <span>{blog.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <FaRegComment className="mr-1" />
                      <span>{blog.comments?.length || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <FaRegEye className="mr-1" />
                      <span>{blog.views || 0}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/blogs/${blog._id}`)}
                    className="flex items-center text-blue-600 hover:text-blue-700 transition-colors group/btn"
                  >
                    <span className="mr-1">Đọc thêm</span>
                    <FaArrowRight className="transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="px-6 pb-4 flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        {showViewAll && blogs.length > 0 && pagination.totalItems > limit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => navigate('/blogs')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <span>Xem tất cả bài viết</span>
              <FaArrowRight className="ml-2 transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BlogList; 