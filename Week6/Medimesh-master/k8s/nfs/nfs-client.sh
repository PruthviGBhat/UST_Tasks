#!/bin/bash
# ════════════════════════════════════════════════════════
# MediMesh — NFS Client Setup Script
# Run this on EVERY Kubernetes node (master + workers)
# ════════════════════════════════════════════════════════

set -e

NFS_SERVER_IP="$1"

if [ -z "$NFS_SERVER_IP" ]; then
  echo "❌ Usage: ./nfs-client-setup.sh <NFS_SERVER_PRIVATE_IP>"
  echo "   Example: ./nfs-client-setup.sh 172.31.42.100"
  exit 1
fi

echo "══════════════════════════════════════════════"
echo "  MediMesh NFS Client Setup"
echo "  NFS Server: ${NFS_SERVER_IP}"
echo "══════════════════════════════════════════════"

# ─── Step 1: Install NFS client package ───────────────
echo ""
echo "📦 Step 1: Installing NFS client utilities..."
sudo apt update
sudo apt install -y nfs-common

# ─── Step 2: Test NFS connectivity ────────────────────
echo ""
echo "🔍 Step 2: Testing NFS server connectivity..."

# showmount queries the NFS server for its exports
showmount -e ${NFS_SERVER_IP}

# Expected output:
# Export list for 172.31.42.100:
# /srv/nfs/medimesh 172.31.0.0/16

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ NFS server is reachable and exports are visible!"
else
  echo ""
  echo "❌ Cannot reach NFS server. Check:"
  echo "   1. NFS server is running"
  echo "   2. Security group allows port 2049 from this node"
  echo "   3. Both instances are in the same VPC"
  exit 1
fi

# ─── Step 3: Test mount (optional verification) ──────
echo ""
echo "🔗 Step 3: Test mounting NFS share..."
sudo mkdir -p /tmp/nfs-test
sudo mount -t nfs ${NFS_SERVER_IP}:/srv/nfs/medimesh /tmp/nfs-test

# Create a test file
echo "NFS test from $(hostname) at $(date)" | sudo tee /tmp/nfs-test/test-$(hostname).txt

echo "Test file created. Contents of NFS share:"
ls -la /tmp/nfs-test/

# Unmount test
sudo umount /tmp/nfs-test
sudo rmdir /tmp/nfs-test

echo ""
echo "══════════════════════════════════════════════"
echo "  ✅ NFS Client Setup Complete on $(hostname)"
echo "══════════════════════════════════════════════"
