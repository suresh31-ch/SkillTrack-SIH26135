import React, { useState } from 'react';
import { Batch, Course } from '../../../types';
import { Card, Badge, Button, Input, Modal } from '../../ui';
import { formatDate } from '../../../lib/utils';
import {
  Layers,
  Plus,
  Search,
  Calendar,
  Users,
  MapPin,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  GraduationCap,
  CalendarCheck,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface BatchManagementViewProps {
  batches: Batch[];
  courses: Course[];
  onCreateBatch: (batchData: Omit<Batch, 'id' | 'created_at'>) => void;
  onUpdateBatch: (batchId: string, updates: Partial<Batch>) => void;
  onDeleteBatch: (batchId: string) => void;
  onNavigateToStudents: (batchId: string) => void;
  onNavigateToAttendance: (batchId: string) => void;
}

export const BatchManagementView: React.FC<BatchManagementViewProps> = ({
  batches,
  courses,
  onCreateBatch,
  onUpdateBatch,
  onDeleteBatch,
  onNavigateToStudents,
  onNavigateToAttendance
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming' | 'completed' | 'paused'>('all');

  // Create Batch Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || 'crs-001');
  const [newName, setNewName] = useState('');
  const [newTrainerName, setNewTrainerName] = useState('Prof. Rajesh Kulkarni');
  const [newTrainerEmail, setNewTrainerEmail] = useState('rajesh.kulkarni@msias.edu.in');
  const [newStartDate, setNewStartDate] = useState('2026-09-01');
  const [newEndDate, setNewEndDate] = useState('2026-12-31');
  const [newCapacity, setNewCapacity] = useState(30);
  const [newSchedule, setNewSchedule] = useState('Mon - Fri, 09:00 AM - 01:00 PM');
  const [newClassroom, setNewClassroom] = useState('Advanced Technical Lab 1, Floor 2');

  // Edit Batch Modal State
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  const filteredBatches = batches.filter(b => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.course_name && b.course_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.trainer_name && b.trainer_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || (b.status || 'active') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const selectedCourse = courses.find(c => c.id === newCourseId) || courses[0];

    onCreateBatch({
      course_id: selectedCourse?.id || 'crs-001',
      course_name: selectedCourse?.name || 'Vocational Tech Program',
      training_center_id: 'tc-001',
      organization_id: 'org-maha-001',
      name: newName.trim(),
      trainer_name: newTrainerName.trim(),
      trainer_email: newTrainerEmail.trim(),
      start_date: newStartDate,
      end_date: newEndDate,
      capacity: Number(newCapacity) || 30,
      enrolled_count: 0,
      status: 'active',
      schedule: newSchedule.trim(),
      classroom: newClassroom.trim()
    });

    setIsCreateModalOpen(false);
    setNewName('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;

    onUpdateBatch(editingBatch.id, {
      name: editingBatch.name,
      trainer_name: editingBatch.trainer_name,
      trainer_email: editingBatch.trainer_email,
      start_date: editingBatch.start_date,
      end_date: editingBatch.end_date,
      capacity: Number(editingBatch.capacity),
      status: editingBatch.status,
      schedule: editingBatch.schedule,
      classroom: editingBatch.classroom
    });

    setEditingBatch(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 mb-2">
            <Layers className="w-3.5 h-3.5" />
            Cohort Administration
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Batch & Cohort Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure student capacity, assign certified trainers, manage schedules, and track cohort progression.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="shrink-0 font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create New Batch
        </Button>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search batches, courses, trainers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {(['all', 'active', 'upcoming', 'completed', 'paused'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBatches.map(batch => {
          const enrolled = batch.enrolled_count || 0;
          const capacity = batch.capacity || 30;
          const fillPercent = Math.min(100, Math.round((enrolled / capacity) * 100));

          return (
            <Card key={batch.id} className="p-5 border-slate-200 bg-white hover:border-indigo-300 transition-all shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">{batch.name}</h3>
                    <Badge
                      variant={
                        batch.status === 'completed'
                          ? 'purple'
                          : batch.status === 'upcoming'
                          ? 'warning'
                          : batch.status === 'paused'
                          ? 'danger'
                          : 'success'
                      }
                    >
                      {batch.status ? batch.status.toUpperCase() : 'ACTIVE'}
                    </Badge>
                  </div>
                  <p className="text-xs text-indigo-600 font-semibold mt-1 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {batch.course_name || 'Vocational Tech Curriculum'}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingBatch(batch)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    title="Edit Batch"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to remove ${batch.name}?`)) {
                        onDeleteBatch(batch.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete Batch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Batch Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100 text-slate-600">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    Trainer: <strong className="text-slate-900">{batch.trainer_name || 'Prof. Rajesh Kulkarni'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {formatDate(batch.start_date)} → {formatDate(batch.end_date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{batch.schedule || 'Mon - Fri (Morning)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{batch.classroom || 'Lab Facility 1'}</span>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Seat Utilization:</span>
                  <span className="text-slate-900 font-bold">
                    {enrolled} / {capacity} Enrolled ({fillPercent}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      fillPercent >= 100 ? 'bg-emerald-600' : fillPercent > 60 ? 'bg-indigo-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onNavigateToStudents(batch.id)}
                  className="text-xs flex-1"
                >
                  <Users className="w-3.5 h-3.5 mr-1" />
                  View Enrolled ({enrolled})
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onNavigateToAttendance(batch.id)}
                  className="text-xs flex-1"
                >
                  <CalendarCheck className="w-3.5 h-3.5 mr-1" />
                  Log Attendance
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredBatches.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Batches Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No student cohorts match your search or filter criteria. Create a new cohort to get started.
          </p>
          <Button size="sm" variant="primary" onClick={() => setIsCreateModalOpen(true)} className="mt-4">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Create First Batch
          </Button>
        </div>
      )}

      {/* Modal 1: Create Batch */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create Student Batch" size="md">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Accredited Course Curriculum</label>
            <select
              value={newCourseId}
              onChange={e => setNewCourseId(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.duration})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Batch Name / Identifier"
            placeholder="e.g. Batch 2026-Q1 (Alpha) or EV Tech Cohort 15"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Assigned Lead Trainer"
              value={newTrainerName}
              onChange={e => setNewTrainerName(e.target.value)}
              required
            />
            <Input
              label="Trainer Email"
              type="email"
              value={newTrainerEmail}
              onChange={e => setNewTrainerEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={newStartDate}
              onChange={e => setNewStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={newEndDate}
              onChange={e => setNewEndDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Intake Capacity (Seats)"
              type="number"
              min={5}
              max={100}
              value={newCapacity}
              onChange={e => setNewCapacity(Number(e.target.value))}
              required
            />
            <Input
              label="Classroom / Lab Location"
              value={newClassroom}
              onChange={e => setNewClassroom(e.target.value)}
              required
            />
          </div>

          <Input
            label="Daily Class Schedule"
            placeholder="e.g. Mon - Fri, 09:00 AM - 01:00 PM"
            value={newSchedule}
            onChange={e => setNewSchedule(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="bg-indigo-600 text-white">
              Create Cohort
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Edit Batch */}
      {editingBatch && (
        <Modal isOpen={!!editingBatch} onClose={() => setEditingBatch(null)} title={`Edit Batch: ${editingBatch.name}`} size="md">
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Batch Name"
              value={editingBatch.name}
              onChange={e => setEditingBatch({ ...editingBatch, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Lead Trainer"
                value={editingBatch.trainer_name || ''}
                onChange={e => setEditingBatch({ ...editingBatch, trainer_name: e.target.value })}
                required
              />
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={editingBatch.status || 'active'}
                  onChange={e => setEditingBatch({ ...editingBatch, status: e.target.value as any })}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                >
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Start Date"
                type="date"
                value={editingBatch.start_date}
                onChange={e => setEditingBatch({ ...editingBatch, start_date: e.target.value })}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={editingBatch.end_date}
                onChange={e => setEditingBatch({ ...editingBatch, end_date: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Capacity"
                type="number"
                value={editingBatch.capacity}
                onChange={e => setEditingBatch({ ...editingBatch, capacity: Number(e.target.value) })}
                required
              />
              <Input
                label="Classroom"
                value={editingBatch.classroom || ''}
                onChange={e => setEditingBatch({ ...editingBatch, classroom: e.target.value })}
                required
              />
            </div>

            <Input
              label="Schedule"
              value={editingBatch.schedule || ''}
              onChange={e => setEditingBatch({ ...editingBatch, schedule: e.target.value })}
              required
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="secondary" size="sm" onClick={() => setEditingBatch(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-indigo-600 text-white">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
