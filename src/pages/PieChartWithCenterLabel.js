import * as React from 'react';
import { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { animated, useSpring } from '@react-spring/web';

// Import your components
import Completed from '../components/Completed';
import Paused from '../components/Paused';
import Live from '../components/Live';
import NotLive from '../components/NotLive';

const size = {
  width: 800,
  height: 340,
};

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 18,
  fontWeight: 'bold',
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function PieChartWithCenterLabel({ 
  campaignData = [], 
  onStatusSelect, 
  selectedStatus 
}) {
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/status-summary`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = Object.entries(data).map(([label, value], idx) => ({
          id: idx,           // REQUIRED for interactivity
          rawLabel: label,
          value,
        }));
        setStatusData(formatted);
      })
      .catch((err) => {
        console.error('Error fetching status summary:', err.message);
      });
  }, []);

  const total = statusData.reduce((sum, entry) => sum + entry.value, 0);

  const enhancedData = statusData.map((item) => ({
    id: item.id,
    rawLabel: item.rawLabel,
    value: item.value,
    label: `${item.rawLabel} (${item.value}, ${Math.round(
      (item.value / total) * 100
    )}%)`,
  }));

  const animationProps = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 200, friction: 20 },
  });

  const handleItemClick = (_, clickedItem) => {
    console.log('Raw clicked item from chart:', clickedItem);
    const fullItem = enhancedData.find((entry) => entry.id === clickedItem.id);
    console.log('Resolved full data item:', fullItem);
    if (onStatusSelect) {
      onStatusSelect(fullItem?.rawLabel);
    }
  };

  const renderComponent = () => {
    const statusProps = {
      data: campaignData,
      onClose: () => onStatusSelect && onStatusSelect(null)
    };

    switch (selectedStatus) {
      case 'Completed':
        return <Completed {...statusProps} />;
      case 'Paused':
        return <Paused {...statusProps} />;
      case 'Live':
        return <Live {...statusProps} />;
      case 'Not Live':
        return <NotLive {...statusProps} />;
      default:
        return null;
    }
  };

  // If a status is selected, show only that component
  if (selectedStatus) {
    return renderComponent();
  }

  return (
    <animated.div style={animationProps}>
      <PieChart
        series={[
          {
            data: enhancedData,
            innerRadius: 80,
            outerRadius: 110,
            paddingAngle: 5,
            cornerRadius: 6,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { additionalRadius: -20, color: 'gray' },
            onItemClick: handleItemClick,
          },
        ]}
        {...size}
      >
        <PieCenterLabel>{total} Total</PieCenterLabel>
      </PieChart>
    </animated.div>
  );
}
