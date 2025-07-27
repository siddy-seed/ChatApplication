import React from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Video } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

export const CallsTab = () => {
  const calls = [
    {
      id: '1',
      contactName: 'Alice Johnson',
      type: 'outgoing',
      callType: 'voice',
      timestamp: new Date(Date.now() - 3600000),
      duration: '5:23'
    },
    {
      id: '2',
      contactName: 'Bob Smith',
      type: 'incoming',
      callType: 'video',
      timestamp: new Date(Date.now() - 7200000),
      duration: '12:45'
    },
    {
      id: '3',
      contactName: 'Carol Davis',
      type: 'missed',
      callType: 'voice',
      timestamp: new Date(Date.now() - 86400000)
    },
    {
      id: '4',
      contactName: 'David Wilson',
      type: 'outgoing',
      callType: 'voice',
      timestamp: new Date(Date.now() - 172800000),
      duration: '2:15'
    }
  ];

  const formatTime = (timestamp) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'HH:mm');
    } else if (isYesterday(timestamp)) {
      return 'Yesterday';
    } else {
      return format(timestamp, 'dd/MM/yyyy');
    }
  };

  const getCallIcon = (type) => {
    switch (type) {
      case 'incoming':
        return <PhoneIncoming size={16} style={{ color: '#22c55e' }} />;
      case 'outgoing':
        return <PhoneOutgoing size={16} style={{ color: '#3b82f6' }} />;
      case 'missed':
        return <PhoneMissed size={16} style={{ color: '#ef4444' }} />;
    }
  };

  return (
    <div className="flex flex-col" style={{ flex: 1 }}>
      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <div className="flex items-center justify-between">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Calls</h2>
          <button className="btn btn-ghost btn-sm">
            <Phone size={20} />
          </button>
        </div>
      </div>

      {/* Calls List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div>
          {calls.map((call) => (
            <div
              key={call.id}
              style={{
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
                transition: 'background-color 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(243, 244, 246, 0.5)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div className="avatar">
                {call.contactName[0]}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ 
                    fontWeight: 500, 
                    color: '#111827',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {call.contactName}
                  </h3>
                  {call.callType === 'video' && (
                    <Video size={16} style={{ color: '#6b7280' }} />
                  )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getCallIcon(call.type)}
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {call.duration ? call.duration : 'No answer'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                  {formatTime(call.timestamp)}
                </span>
                <button className="btn btn-ghost" style={{ width: '32px', height: '32px', padding: 0 }}>
                  <Phone size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
