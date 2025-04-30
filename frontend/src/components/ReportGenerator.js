import React from 'react';
import { Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ReportGenerator = ({ data, type, title }) => {
  const generateReport = () => {
    let reportData = [];
    let fileName = '';

    if (type === 'destinations') {
      // Destinations Report
      reportData = data.map(destination => ({
        'Destination Name': destination.name,
        'Location': destination.location,
        'Category': destination.category,
        'Best Time to Visit': destination.bestTimeToVisit,
        'Weather': destination.weather,
        'Transportation': destination.transportation,
        'Description': destination.description,
        'Rating': destination.rating || 'N/A',
        'Number of Reviews': destination.reviews?.length || 0,
        'Highlights': destination.highlights?.join(', ') || 'N/A'
      }));
      fileName = 'destinations_report.xlsx';
    } else if (type === 'experiences') {
      // Experiences Report
      const experiencesByDestination = {};
      data.forEach(review => {
        if (!experiencesByDestination[review.destination?.name]) {
          experiencesByDestination[review.destination?.name] = {
            destination: review.destination?.name,
            totalReviews: 0,
            averageRating: 0,
            ratings: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            commonThemes: new Set(),
            recentReviews: []
          };
        }
        
        const destData = experiencesByDestination[review.destination?.name];
        destData.totalReviews++;
        destData.ratings[review.rating]++;
        destData.averageRating = (destData.averageRating * (destData.totalReviews - 1) + review.rating) / destData.totalReviews;
        
        // Extract common themes from review text
        const themes = ['amazing', 'beautiful', 'excellent', 'great', 'wonderful', 'recommend', 'must visit'];
        themes.forEach(theme => {
          if (review.comment?.toLowerCase().includes(theme)) {
            destData.commonThemes.add(theme);
          }
        });

        // Keep track of recent reviews
        destData.recentReviews.push({
          rating: review.rating,
          comment: review.comment,
          date: new Date(review.createdAt).toLocaleDateString()
        });
      });

      reportData = Object.values(experiencesByDestination).map(dest => ({
        'Destination': dest.destination,
        'Total Reviews': dest.totalReviews,
        'Average Rating': dest.averageRating.toFixed(1),
        '5-Star Reviews': dest.ratings[5],
        '4-Star Reviews': dest.ratings[4],
        '3-Star Reviews': dest.ratings[3],
        '2-Star Reviews': dest.ratings[2],
        '1-Star Reviews': dest.ratings[1],
        'Common Themes': Array.from(dest.commonThemes).join(', '),
        'Recent Reviews': dest.recentReviews.slice(0, 3).map(r => 
          `${r.rating}★ - ${r.comment?.substring(0, 50)}... (${r.date})`
        ).join('\n')
      }));
      fileName = 'experiences_report.xlsx';
    }

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(reportData);
    
    // Set column widths
    const wscols = reportData[0] ? Object.keys(reportData[0]).map(() => ({ wch: 20 })) : [];
    ws['!cols'] = wscols;

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
  };

  return (
    <div className="mt-8 text-center">
      <Button
        variant="contained"
        color="primary"
        startIcon={<DownloadIcon />}
        onClick={generateReport}
        className="bg-[#ff6347] hover:bg-[#ff4500] text-white rounded-lg 
                 transition-all duration-300 transform hover:scale-105 
                 shadow-md hover:shadow-lg"
      >
        Download {title} Report
      </Button>
    </div>
  );
};

export default ReportGenerator; 