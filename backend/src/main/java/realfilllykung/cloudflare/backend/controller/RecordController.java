package realfilllykung.cloudflare.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
public class RecordController {
    @GetMapping("records")
    public String getMethodName(@RequestParam String param) {
        return new String();
    }

    @PostMapping("records")
    public String postMethodName(@RequestBody String entity) {
        return entity;
    }

    @PutMapping("records/{id}")
    public String putMethodName(@PathVariable String id, @RequestBody String entity) {
        return entity;
    }

    @DeleteMapping("records/{id}")
    public String deleteMethodName(@PathVariable String id) {
        return "Deleted record with id: " + id;
    }   
}
