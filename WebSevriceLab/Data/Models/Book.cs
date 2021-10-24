using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebSevriceLab.Data.Models
{
    public class Book : Model
    {
        public string Name { get; set; }
        public string Description { get; set;}
        [ForeignKey("Author")]
        public int AuthorId { get; set; }
    }
}
