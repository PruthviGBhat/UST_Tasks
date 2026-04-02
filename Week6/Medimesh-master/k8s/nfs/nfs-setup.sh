#!/bin/bash
# ════════════════════════════════════════════════════════
# MediMesh — NFS Server Setup Script
# Run this on the NFS Server EC2 instance
# ════════════════════════════════════════════════════════

set -e  # Exit on any error

echo "══════════════════════════════════════════════"
echo "  MediMesh NFS Server Setup"
echo "══════════════════════════════════════════════"

# ─── Step 1: Update system packages ───────────────────
echo ""
echo "📦 Step 1: Updating system packages..."
sudo apt update && sudo apt upgrade -y

# ─── Step 2: Install NFS server package ───────────────
echo ""
echo "📦 Step 2: Installing NFS server..."
sudo apt install -y nfs-kernel-server

# ─── Step 3: Create the shared directory ──────────────
# This is where ALL Kubernetes PV data will be stored
echo ""
echo "📁 Step 3: Creating shared NFS directory..."
sudo mkdir -p /srv/nfs/medimesh

# Set permissions so Kubernetes pods can read/write
# 777 = read+write+execute for everyone
# nobody:nogroup = no specific owner (NFS convention)
sudo chown -R nobody:nogroup /srv/nfs/medimesh
sudo chmod -R 777 /srv/nfs/medimesh

# ─── Step 4: Configure NFS exports ───────────────────
# The /etc/exports file tells NFS which directories
# to share and who can access them

echo ""
echo "📝 Step 4: Configuring NFS exports..."

# Check your VPC CIDR — replace 172.31.0.0/16 if different
VPC_CIDR="172.31.0.0/16"

# Backup existing exports file
sudo cp /etc/exports /etc/exports.backup

# Add our export rule
# Format: <directory> <allowed_network>(<options>)
#
# Options explained:
#   rw             = read-write access
#   sync           = write data to disk before confirming (safe)
#   no_subtree_check = don't verify file is in subtree (faster)
#   no_root_squash = allow root access from clients
#                    (needed for Kubernetes pods running as root)

echo "/srv/nfs/medimesh ${VPC_CIDR}(rw,sync,no_subtree_check,no_root_squash)" \
  | sudo tee -a /etc/exports

echo ""
echo "📄 Current /etc/exports:"
cat /etc/exports

# ─── Step 5: Apply the export configuration ──────────
echo ""
echo "🔄 Step 5: Applying NFS exports..."
sudo exportfs -rav

# Expected output:
# exporting 172.31.0.0/16:/srv/nfs/medimesh

# ─── Step 6: Start and enable NFS server ─────────────
echo ""
echo "🚀 Step 6: Starting NFS server..."
sudo systemctl restart nfs-kernel-server
sudo systemctl enable nfs-kernel-server

# ─── Step 7: Verify NFS server is running ────────────
echo ""
echo "✅ Step 7: Verification..."
echo ""
echo "NFS Server Status:"
sudo systemctl status nfs-kernel-server --no-pager | head -5
echo ""
echo "Exported filesystems:"
sudo exportfs -v
echo ""
echo "══════════════════════════════════════════════"
echo "  ✅ NFS Server Setup Complete!"
echo ""
echo "  Shared directory: /srv/nfs/medimesh"
echo "  Allowed network:  ${VPC_CIDR}"
echo ""
echo "  Private IP of this server:"
hostname -I | awk '{print "  " $1}'
echo ""
echo "  ⚠️  Save the private IP above!"
echo "  You need it for Kubernetes configuration."
echo "══════════════════════════════════════════════"
