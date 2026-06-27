import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const articles = [
  {
    title: '10 tips for first-time homebuyers in 2026',
    category: 'Buying Guide',
    image: '/images/blog-featured.jpg',
    featured: true,
  },
  {
    title: 'Market trends: What to expect in real estate this year',
    category: 'Market Insights',
    image: '/images/blog-1.jpg',
    featured: false,
  },
  {
    title: 'Smart home features that actually increase property value',
    category: 'Home Improvement',
    image: '/images/blog-2.jpg',
    featured: false,
  },
  {
    title: 'Renting vs buying: A complete comparison for 2026',
    category: 'Rentals',
    image: '/images/blog-3.jpg',
    featured: false,
  },
];

export default function ArticlesSection() {
  const featuredArticle = articles.find((a) => a.featured);
  const sideArticles = articles.filter((a) => !a.featured);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4">
            Real estate insights & advice
          </h2>
          <p className="text-text-secondary max-w-md mx-auto">
            Stay informed with the latest market trends, buying tips, and property guides from our experts.
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Featured Article */}
          {featuredArticle && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link to="#" className="group block">
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <motion.img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-text-primary">
                    {featuredArticle.category}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-text-primary group-hover:text-primary transition-colors leading-tight">
                  {featuredArticle.title}
                </h3>
              </Link>
            </motion.div>
          )}

          {/* Side Articles */}
          <div className="space-y-6">
            {sideArticles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to="#" className="group flex gap-4">
                  <div className="relative overflow-hidden rounded-xl flex-shrink-0 w-32 h-24 md:w-40 md:h-28">
                    <motion.img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-xs font-medium text-text-muted mb-2">
                      {article.category}
                    </span>
                    <h4 className="text-base md:text-lg font-semibold text-text-primary group-hover:text-primary transition-colors leading-tight line-clamp-2">
                      {article.title}
                    </h4>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
