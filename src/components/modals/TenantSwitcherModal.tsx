import React from 'react';
import { Modal, Button, Badge } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { LocalDbService } from '../../lib/supabase';
import { Building2, Check, MapPin } from 'lucide-react';

interface TenantSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TenantSwitcherModal: React.FC<TenantSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { organization, switchOrganization } = useAuth();
  const allOrganizations = LocalDbService.getOrganizations();

  const handleSelectOrg = (orgId: string) => {
    switchOrganization(orgId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tenant Switcher (Multi-tenant SaaS Architecture)"
      subtitle="Select an isolated customer tenant organization. Each tenant has separate candidates, jobs, and training data."
      maxWidth="lg"
    >
      <div className="space-y-2.5">
        {allOrganizations.map(org => {
          const isSelected = organization?.id === org.id;

          return (
            <div
              key={org.id}
              onClick={() => handleSelectOrg(org.id)}
              className={`flex items-center justify-between p-3.5 rounded-lg border transition-all cursor-pointer shadow-2xs ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 text-slate-900 ring-1 ring-indigo-600'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
              }`}
              id={`card-tenant-${org.id}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg border ${isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{org.name}</h4>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] text-indigo-700 font-semibold bg-indigo-100 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{org.type}</span>
                    <span>•</span>
                    <Badge variant={org.subscription_plan === 'Enterprise' ? 'purple' : 'primary'}>
                      {org.subscription_plan}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{org.location}</span>
                  </div>
                </div>
              </div>

              {!isSelected && (
                <Button size="sm" variant="outline" id={`btn-select-tenant-${org.id}`} className="text-xs">
                  Switch
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
