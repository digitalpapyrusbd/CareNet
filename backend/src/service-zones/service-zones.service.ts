import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ServiceZonesService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        const zone = await this.prisma.service_zones.create({
            data: {
                name: data.name,
                coordinates: data.coordinates,
                coverage_radius: data.coverage_radius,
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
            const coords = zone.coordinates as any;
            const distance = this.calculateDistance(
                lat,
                lng,
                coords.lat,
                coords.lng,
            );
            return distance <= Number(zone.coverage_radius);
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
