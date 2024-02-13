using System;
using System.Collections.Generic;
using AppointEase.Application.Contracts.Identity;
using AppointEase.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AppointEase.Data.Data;

public class AppointEaseContext : IdentityDbContext<ApplicationUser, ApplicationRoles, string>
{
    public AppointEaseContext()
    {
    }

    public AppointEaseContext(DbContextOptions<AppointEaseContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ApplicationRoles> ApplicationRoles { get; set; }
    public virtual DbSet<TblAdmin> TblAdmins { get; set; }
    public virtual DbSet<TblRole> TblRoles { get; set; }
    public virtual DbSet<TblUser> TblUsers { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Data Source=(localdb)\\Local;Initial Catalog=AppointEase;Integrated Security=True; TrustServerCertificate=true;");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TblAdmin>(entity =>
        {
            entity.HasKey(e => e.AdminId);

            entity.ToTable("TblAdmin");

            entity.Property(e => e.AdminId).ValueGeneratedNever();
            entity.Property(e => e.Email).HasMaxLength(80);
            entity.Property(e => e.Password).HasMaxLength(50);
            entity.Property(e => e.Username).HasMaxLength(50);

            entity.HasOne(d => d.RoleNavigation).WithMany(p => p.TblAdmins)
                .HasForeignKey(d => d.Role)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Role");
        });

        modelBuilder.Entity<TblRole>(entity =>
        {
            entity.HasKey(e => e.RoleId);

            entity.ToTable("tblRole");

            entity.Property(e => e.RoleName).HasMaxLength(20);
        });

        modelBuilder.Entity<TblUser>(entity =>
        {
            entity.HasKey(e => e.UserId);

            entity.ToTable("TblUser");

            entity.Property(e => e.Address).HasColumnType("text");
            entity.Property(e => e.ContactNumber)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Email).HasMaxLength(80);
            entity.Property(e => e.Gander)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(50);
            entity.Property(e => e.PersonalNumber)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Surname).HasMaxLength(50);

            entity.HasOne(d => d.RoleNavigation).WithMany(p => p.TblUsers)
                .HasForeignKey(d => d.Role)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserRole");
        });

        // Thirrni metodën e pjesshme OnModelCreatingPartial
        //OnModelCreatingPartial(modelBuilder);
    }

    // Implementoni metodën e pjesshme OnModelCreatingPartial
    //partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
