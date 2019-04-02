package pl.masi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.masi.entities.Position;
import pl.masi.exceptions.AppException;
import pl.masi.services.interfaces.IPositionService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/position")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class PositionController {

    private final IPositionService positionService;

    @GetMapping(value = "/list")
    public List<Position> getPositions() {
        return positionService.getAll();
    }

    @PostMapping(value = "/create", consumes = "application/json", produces = "application/json")
    public Position createPosition(@RequestBody Position position) throws AppException {
        return positionService.createPosition(position);
    }

    @PutMapping(value = "/{name}")
    public boolean togglePosition(@PathVariable String name, @RequestParam("active") boolean isActive) throws AppException {
        return positionService.togglePosition(name, isActive);
    }

    @DeleteMapping(value = "/{name}")
    public void deletePosition(@PathVariable String name) throws AppException {
        positionService.deletePosition(name);
    }

    @ExceptionHandler({AppException.class})
    public void handleException(AppException appException, HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.BAD_REQUEST.value(), appException.toString());
    }
}
