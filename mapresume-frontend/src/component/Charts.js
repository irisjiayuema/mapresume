import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import heap from '../assets/image/heapmap.png';
import scatter1 from '../assets/image/scatter1.png';
import { useNavigate } from 'react-router-dom';
import '../assets/style/Charts.css';

export default function ChartCards() {
    const navigate = useNavigate();
    const goHeatMap = ()=>{
        navigate('/charts/heatmap');

    }
    return (
        <div className='chart-container'>

             <Card sx={{ maxWidth: 345 }}>
                <CardActionArea onClick={goHeatMap}>
                    <CardMedia
                        component="img"
                        height="140"
                        image = {heap}
                        alt="correlation"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                        correlation matrix
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        This is a correlation matrix representing some key data points.
                        </Typography>
                    </CardContent>
                    
                </CardActionArea>
            </Card>
            
            <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="140"
                        image = {scatter1}
                        alt="scatter1"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                        Scatter plot
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        This is a scatter plot for some of our important data.
                        </Typography>
                    </CardContent>
                    
                </CardActionArea>
            </Card>
        </div>
     
    );
  }