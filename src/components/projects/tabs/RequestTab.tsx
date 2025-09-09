import React, { useState } from 'react';
import { Plus, Check, X, DollarSign, MessageSquare } from 'lucide-react';
import { AdditionalRequest } from '../../../types';
import { RequestService } from '../../../services/requestService';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';
import { Table } from '../../common/Table';
import { StatusBadge } from '../../common/StatusBadge';
import { RequestForm } from './RequestForm';
import { ApproveRejectModal } from './ApproveRejectModal';
import toast from 'react-hot-toast';

interface RequestTabProps {
  projectId: string;
  requests: AdditionalRequest[];
  onRequestsChange: (requests: AdditionalRequest[]) => void;
}

export const RequestTab: React.FC<RequestTabProps> = ({
  projectId,
  requests,
  onRequestsChange
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showApproveRejectModal, setShowApproveRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AdditionalRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  const handleCreateRequest = async (requestData: Omit<AdditionalRequest, 'id' | 'created_at' | 'updated_at' | 'status' | 'approved_by' | 'approved_at' | 'rejection_reason'>) => {
    try {
      const newRequest = await RequestService.createRequest(requestData);
      onRequestsChange([...requests, newRequest]);
      setShowModal(false);
      toast.success('Request created successfully');
    } catch (error) {
      toast.error('Failed to create request');
      console.error('Failed to create request:', error);
    }
  };

  const handleApproveRequest = async (requestId: string, approvedBy: string) => {
    try {
      const updatedRequest = await RequestService.approveRequest(requestId, approvedBy);
      onRequestsChange(requests.map(r => r.id === requestId ? updatedRequest : r));
      setShowApproveRejectModal(false);
      setSelectedRequest(null);
      toast.success('Request approved successfully');
    } catch (error) {
      toast.error('Failed to approve request');
      console.error('Failed to approve request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string, rejectionReason: string) => {
    try {
      const updatedRequest = await RequestService.rejectRequest(requestId, rejectionReason);
      onRequestsChange(requests.map(r => r.id === requestId ? updatedRequest : r));
      setShowApproveRejectModal(false);
      setSelectedRequest(null);
      toast.success('Request rejected');
    } catch (error) {
      toast.error('Failed to reject request');
      console.error('Failed to reject request:', error);
    }
  };

  const getStatusColor = (status: AdditionalRequest['status']) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  const columns = [
    {
      key: 'requested_amount',
      header: 'Amount',
      render: (request: AdditionalRequest) => (
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-semibold">${request.requested_amount.toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (request: AdditionalRequest) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 truncate" title={request.reason}>
            {request.reason}
          </p>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (request: AdditionalRequest) => (
        <StatusBadge 
          status={request.status} 
          variant={getStatusColor(request.status)}
        />
      )
    },
    {
      key: 'approved_by',
      header: 'Approved By',
      render: (request: AdditionalRequest) => (
        request.approved_by || '-'
      )
    },
    {
      key: 'created_at',
      header: 'Requested',
      render: (request: AdditionalRequest) => new Date(request.created_at).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (request: AdditionalRequest) => (
        <div className="flex items-center space-x-2">
          {request.status === 'Pending' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                icon={Check}
                className="text-green-600 hover:text-green-700"
                onClick={() => {
                  setSelectedRequest(request);
                  setActionType('approve');
                  setShowApproveRejectModal(true);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                icon={X}
                className="text-red-600 hover:text-red-700"
                onClick={() => {
                  setSelectedRequest(request);
                  setActionType('reject');
                  setShowApproveRejectModal(true);
                }}
              />
            </>
          )}
          {request.rejection_reason && (
            <Button
              variant="ghost"
              size="sm"
              icon={MessageSquare}
              className="text-gray-600 hover:text-gray-700"
              onClick={() => alert(`Rejection Reason: ${request.rejection_reason}`)}
            />
          )}
        </div>
      )
    }
  ];

  const totalRequested = requests.reduce((sum, r) => sum + r.requested_amount, 0);
  const totalApproved = requests
    .filter(r => r.status === 'Approved')
    .reduce((sum, r) => sum + r.requested_amount, 0);
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Additional Budget Requests</h3>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          New Request
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Total Requested</div>
          <div className="text-2xl font-bold text-blue-900">${totalRequested.toLocaleString()}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Total Approved</div>
          <div className="text-2xl font-bold text-green-900">${totalApproved.toLocaleString()}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-sm text-yellow-600 font-medium">Pending Requests</div>
          <div className="text-2xl font-bold text-yellow-900">{pendingRequests}</div>
        </div>
      </div>

      <Table
        data={requests}
        columns={columns}
        emptyMessage="No additional requests found"
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="New Additional Budget Request"
        maxWidth="md"
      >
        <RequestForm
          projectId={projectId}
          onSubmit={handleCreateRequest}
          onCancel={() => setShowModal(false)}
        />
      </Modal>

      <ApproveRejectModal
        isOpen={showApproveRejectModal}
        onClose={() => {
          setShowApproveRejectModal(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        actionType={actionType}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />
    </div>
  );
};