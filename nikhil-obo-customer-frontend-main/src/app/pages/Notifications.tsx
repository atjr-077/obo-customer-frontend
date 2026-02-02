import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '@/app/context/ShopContext';
import { Bell, Package, Truck, Tag, Info, Check } from 'lucide-react';

export const Notifications: React.FC = () => {
  const { user, notifications, markNotificationRead } = useShop();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Bell size={64} className="mx-auto mb-4 text-gray-400" />
        <h1 className="text-2xl font-bold mb-4">Please log in to view notifications</h1>
        <Link to="/login" className="text-blue-600 underline">
          Go to Login
        </Link>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package size={24} className="text-blue-600" />;
      case 'delivery':
        return <Truck size={24} className="text-green-600" />;
      case 'promo':
        return <Tag size={24} className="text-orange-600" />;
      default:
        return <Info size={24} className="text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
      }
    }
  };

  const handleNotificationClick = (id: string, read: boolean) => {
    if (!read) {
      markNotificationRead(id);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-gray-600">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {notifications.length > 0 && unreadCount > 0 && (
            <button
              onClick={() => {
                notifications.forEach(n => {
                  if (!n.read) markNotificationRead(n.id);
                });
              }}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              <Check size={16} />
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">No notifications yet</h2>
            <p className="text-gray-600 mb-6">
              We'll notify you when something important happens
            </p>
            <Link
              to="/"
              className="inline-block bg-black text-white px-8 py-3 rounded hover:bg-gray-800"
            >
              Go to Home
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id, notification.read)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  notification.read
                    ? 'bg-white hover:bg-gray-50'
                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                }`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className={`font-bold ${!notification.read ? 'text-blue-900' : ''}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                    <p className={`text-sm mb-2 ${
                      notification.read ? 'text-gray-600' : 'text-blue-800'
                    }`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(notification.date)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
