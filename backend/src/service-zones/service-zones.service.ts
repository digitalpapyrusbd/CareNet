import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ServiceZonesService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        const zone = await this.prisma.service_zones.create({
            data: {
                company_id: data.company_id,
                zone_name: data.zone_name,
                region_code: data.region_code || 'BD',
                boundary_geojson: data.boundary_geojson,
            },
        });

        return zone;
    }

    async findAll() {
        const zones = await this.prisma.service_zones.findMany({
            where: { is_active: true },
        });

        return zones;
    }

    async checkCoverage(lat: number, lng: number) {
        // Simple distance calculation - in production use PostGIS
        const zones = await this.findAll();

        const coveredZones = zones.filter((zone) => {
            const geojson = zone.boundary_geojson as any;
            // Simple check - in production use proper GeoJSON point-in-polygon
            if (geojson && geojson.coordinates) {
                // Simplified distance calculation
                const center = geojson.coordinates[0]?.[0] || [lng, lat];
                const distance = this.calculateDistance(lat, lng, center[1], center[0]);
                // Use 10km default coverage radius since coverage_radius field doesn't exist in schema
                return distance <= 10;
            }
            return false;
        });

        return { covered: coveredZones.length > 0, zones: coveredZones };
    }

    private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
        const R = 6371; // Earth radius in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLng = this.deg2rad(lng2 - lng1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) *
            Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }
}
