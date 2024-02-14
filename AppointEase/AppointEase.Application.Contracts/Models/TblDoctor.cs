using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppointEase.Application.Contracts.Models
{
    public partial class TblDoctor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int IdClinci { get; set; }
        public string EmriDoktorrit { get; set; }
        public string Specializimet { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }



        public virtual TblClinic ClinicNavigation { get; set; } = null!;
    }
}
