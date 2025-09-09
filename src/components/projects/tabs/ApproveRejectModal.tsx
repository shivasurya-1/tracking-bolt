import React, { useState } from 'react';
import { AdditionalRequest } from '../../../types';
import { Modal } from '../../common/Modal';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { User, MessageSquare } from 'lucide-react';

interface ApproveRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: AdditionalRequest | null;
  actionType: 'approve' | 'reject';
  onApprove: (requestId: string, approvedBy: string) => void;
  onReject: (requestId: string, rejectionReason: string) => void;
}

export const ApproveRejectModal: React.FC<ApproveRejectModalProps> = ({
  isOpen,
  onClose,
  request,
  actionType,
  onApprove,
  onReject
}) => {
  const [approvedBy, setApprovedBy] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;

    setErrors({});
    const newErrors: Record<string, string> = {};

    if (actionType === 'approve' && !approvedBy) {
      newErrors.approvedBy = 'Approver name is required';
    }
    if (actionType === 'reject' && !rejectionReason) {
      newErrors.rejectionReason = 'Rejection reason is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      if (actionType === 'approve') {
        await onApprove(request.id, approvedBy);
      } else {
        await onReject(request.id, rejectionReason);
      }
      setApprovedBy('');
      setRejectionReason('');
    } catch (error) {
      setErrors({ general: `Failed to ${actionType} request` });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setApprovedBy('');
    setRejectionReason('');
    setErrors({});
    onClose();
  };

  if (!request) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`${actionType === 'approve' ? 'Approve' : 'Reject'} Budget Request`}
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Amount:</strong> ${request.requested_amount.toLocaleString()}</div>
            <div><strong>Reason:</strong> {request.reason}</div>
            <div><strong>Requested:</strong> {new Date(request.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {actionType === 'approve' ? (
            <Input
              label="Approved By"
              icon={User}
              value={approvedBy}
              onChange={(e) => setApprovedBy(e.target.value)}
              error={errors.approvedBy}
              placeholder="Enter your name"
              required
            />
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    errors.rejectionReason ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={3}
                  placeholder="Explain why this request is being rejected..."
                  required
                />
              </div>
              {errors.rejectionReason && <p className="mt-1 text-sm text-red-600">{errors.rejectionReason}</p>}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={loading}
              variant={actionType === 'approve' ? 'primary' : 'danger'}
            >
              {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};