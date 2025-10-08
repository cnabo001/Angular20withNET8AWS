using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ORMServiceDBContext.Models
{
    public class StoreModel
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // client-generated GUID
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public decimal Price { get; set; } // maps to NUMERIC(18,2) below
    }
}
