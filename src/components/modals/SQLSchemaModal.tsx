import React, { useState } from 'react';
import { Modal, Button, Badge } from '../ui';
import { SUPABASE_SCHEMA_SQL } from '../../lib/schema.sql';
import { Copy, Check, Database, ShieldCheck, FileCode } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface SQLSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SQLSchemaModal: React.FC<SQLSchemaModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    showToast('Copied to Clipboard', 'Full Supabase PostgreSQL schema with RLS policies copied.', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supabase PostgreSQL Schema & RLS Policies"
      subtitle="Complete database DDL, Multi-tenant Isolation, Indexes, and Row Level Security for SIH26135"
      maxWidth="4xl"
    >
      <div className="space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-700">20+ Relational Tables</span>
            <span className="text-slate-300">•</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-700">Tenant-Isolated RLS Enabled</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="primary">PostgreSQL 15+</Badge>
            <Badge variant="success">Supabase Ready</Badge>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopy}
              id="btn-copy-sql-schema"
            >
              {copied ? 'Copied SQL' : 'Copy Full SQL Script'}
            </Button>
          </div>
        </div>

        <div className="relative rounded-lg border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[460px]">
          <pre className="whitespace-pre">{SUPABASE_SCHEMA_SQL}</pre>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <FileCode className="w-4 h-4 text-slate-500" />
            <span>Apply this in your Supabase SQL Editor to provision all tables & RLS immediately.</span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose} id="btn-close-schema-modal">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
