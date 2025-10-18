import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { eventRequestsAPI, userAPI } from '../../services/api';
import { Calendar, MapPin, Users, Clock, CheckCircle, XCircle, Loader, User } from 'lucide-react';

const EventRequestsManager = () => {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [comments, setComments] = useState('');
  const [requestsWithUsers, setRequestsWithUsers] = useState([]);

  // Fetch pending requests
  const { data: requestsData, isLoading } = useQuery(
    ['pendingEventRequests'],
    () => eventRequestsAPI.getPending({ page: 0, size: 20 }),
    {
      select: (response) => response.data.data.content || [],
    }
  );

  // Fetch user details for each request
  useEffect(() => {
    const fetchUsersForRequests = async () => {
      if (requestsData && requestsData.length > 0) {
        const requestsWithUserData = await Promise.all(
          requestsData.map(async (request) => {
            try {
              const userResponse = await userAPI.getUserById(request.requesterId);
              return {
                ...request,
                requester: userResponse.data.data,
              };
            } catch (error) {
              console.error(`Failed to fetch user ${request.requesterId}:`, error);
              return {
                ...request,
                requester: {
                  username: 'Unknown User',
                  email: 'N/A',
                },
              };
            }
          })
        );
        setRequestsWithUsers(requestsWithUserData);
      } else {
        setRequestsWithUsers([]);
      }
    };

    fetchUsersForRequests();
  }, [requestsData]);

  // Fetch stats
  const { data: statsData } = useQuery(
    ['eventRequestStats'],
    () => eventRequestsAPI.getStats(),
    {
      select: (response) => response.data.data,
    }
  );

  // Approve mutation
  const approveMutation = useMutation(
    ({ id, comments }) => eventRequestsAPI.approve(id, comments),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pendingEventRequests']);
        queryClient.invalidateQueries(['eventRequestStats']);
        setShowApproveModal(false);
        setSelectedRequest(null);
        setComments('');
        alert('Request approved successfully!');
      },
      onError: (error) => {
        alert(error.response?.data?.message || 'Failed to approve request');
      },
    }
  );

  // Reject mutation
  const rejectMutation = useMutation(
    ({ id, comments }) => eventRequestsAPI.reject(id, comments),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pendingEventRequests']);
        queryClient.invalidateQueries(['eventRequestStats']);
        setShowRejectModal(false);
        setSelectedRequest(null);
        setComments('');
        alert('Request rejected successfully');
      },
      onError: (error) => {
        alert(error.response?.data?.message || 'Failed to reject request');
      },
    }
  );

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setShowApproveModal(true);
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const confirmApprove = () => {
    if (selectedRequest) {
      approveMutation.mutate({ id: selectedRequest.id, comments });
    }
  };

  const confirmReject = () => {
    if (selectedRequest && comments.trim()) {
      rejectMutation.mutate({ id: selectedRequest.id, comments });
    } else {
      alert('Please provide a reason for rejection');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading || (requestsData && requestsData.length > 0 && requestsWithUsers.length === 0)) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading requests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {statsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
            <div className="text-2xl font-bold">{statsData.totalRequests || 0}</div>
            <div className="text-sm opacity-90">Total Requests</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white shadow-lg">
            <div className="text-2xl font-bold">{statsData.pendingRequests || 0}</div>
            <div className="text-sm opacity-90">Pending</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
            <div className="text-2xl font-bold">{statsData.approvedRequests || 0}</div>
            <div className="text-sm opacity-90">Approved</div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white shadow-lg">
            <div className="text-2xl font-bold">{statsData.rejectedRequests || 0}</div>
            <div className="text-sm opacity-90">Rejected</div>
          </div>
        </div>
      )}

      {/* Pending Requests */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Pending Event Requests</h2>
        
        {requestsWithUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No pending requests at the moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requestsWithUsers.map((request) => (
              <div
                key={request.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{request.eventName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{request.sportType}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                    <Clock className="w-3 h-3" />
                    Pending Review
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">{request.description}</p>

                {/* Requester Info */}
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {request.requester?.profilePictureUrl ? (
                        <img
                          src={`http://localhost:8080${request.requester.profilePictureUrl}`}
                          alt={request.requester.username}
                          className="w-10 h-10 rounded-full object-cover border-2 border-blue-200 dark:border-blue-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white font-semibold">
                          {request.requester?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {request.requester?.username || 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {request.requester?.email || 'No email'}
                      </p>
                      {request.requester?.firstName && request.requester?.lastName && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                          {request.requester.firstName} {request.requester.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(request.proposedStartDate)} - {formatDate(request.proposedEndDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{request.proposedVenue}</span>
                  </div>
                  {request.expectedParticipants && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{request.expectedParticipants} participants</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Submitted: {formatDate(request.createdAt)}</span>
                  </div>
                </div>

                {request.additionalDetails && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Details:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{request.additionalDetails}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(request)}
                    disabled={approveMutation.isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(request)}
                    disabled={rejectMutation.isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Approve Event Request</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to approve "{selectedRequest.eventName}"? This will create a new event.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comments (Optional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                placeholder="Add any comments for the requester..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmApprove}
                disabled={approveMutation.isLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {approveMutation.isLoading ? 'Approving...' : 'Confirm Approval'}
              </button>
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setComments('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Reject Event Request</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please provide a reason for rejecting "{selectedRequest.eventName}":
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows="4"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                placeholder="Explain why this request is being rejected..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmReject}
                disabled={rejectMutation.isLoading || !comments.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {rejectMutation.isLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setComments('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRequestsManager;
