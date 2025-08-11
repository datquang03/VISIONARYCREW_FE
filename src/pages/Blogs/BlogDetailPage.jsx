import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getBlogById, toggleLike, addComment } from '../../redux/APIs/slices/blogSlice';
import DefaultLayout from '../../components/layout/defaulLayout';
import { FaRegHeart, FaHeart, FaRegComment, FaRegEye, FaArrowLeft } from 'react-icons/fa';

const BlogDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBlog, isLoading } = useSelector((state) => state.blogSlice);
  const { user } = useSelector((state) => state.authSlice);

  useEffect(() => {
    if (id) {
      dispatch(getBlogById(id));
    }
  }, [dispatch, id]);

  const handleLike = () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    dispatch(toggleLike(id));
  };

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (!currentBlog) {
    return (
      <DefaultLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Không tìm thấy bài viết</h2>
          <button
            onClick={() => navigate('/blogs')}
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <FaArrowLeft className="mr-2" /> Quay lại danh sách bài viết
          </button>
        </div>
      </DefaultLayout>
    );
  }

  const isLiked = currentBlog.likes?.includes(user?._id);

  return (
    <DefaultLayout>
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/blogs')}
          className="mb-8 inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Quay lại
        </motion.button>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{currentBlog.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={currentBlog.doctorId?.avatar || '/images/default-avatar.jpg'}
                alt={currentBlog.doctorId?.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">{currentBlog.doctorId?.fullName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(currentBlog.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-gray-500">
              <button
                onClick={handleLike}
                className="flex items-center space-x-1 hover:text-red-500 transition-colors"
              >
                {isLiked ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart />
                )}
                <span>{currentBlog.likes?.length || 0}</span>
              </button>
              <div className="flex items-center space-x-1">
                <FaRegComment />
                <span>{currentBlog.comments?.length || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaRegEye />
                <span>{currentBlog.views || 0}</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Featured Image */}
        {currentBlog.images && currentBlog.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <img
              src={currentBlog.images[0]}
              alt={currentBlog.title}
              className="w-full h-[400px] object-cover rounded-xl shadow-lg"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: currentBlog.content }}
        />

        {/* Tags */}
        {currentBlog.tags && currentBlog.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {currentBlog.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Comments Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Bình luận ({currentBlog.comments?.length || 0})
          </h2>
          {/* Comments list will be implemented here */}
        </motion.section>
      </article>
    </DefaultLayout>
  );
};

export default BlogDetailPage;
