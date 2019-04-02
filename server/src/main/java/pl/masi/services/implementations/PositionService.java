package pl.masi.services.implementations;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import pl.masi.entities.Position;
import pl.masi.exceptions.AppException;
import pl.masi.repositories.PositionRepository;
import pl.masi.services.interfaces.IPositionService;

import java.util.Collection;
import java.util.Comparator;
import java.util.List;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class PositionService implements IPositionService {

    private final PositionRepository positionRepository;

    @Override
    public List<Position> getAll() {
        List<Position> positions = positionRepository.findAll();
        positions.sort(Comparator.comparing(Position::getName));
        return positions;
    }

    @Override
    public Position createPosition(Position position) throws AppException {
        try {
            return positionRepository.save(position);
        } catch (DuplicateKeyException e) {
            throw new AppException("POSITION_DUPLICATE_NAME", "Position with given name already exists");
        }
    }

    @Override
    public boolean togglePosition(String name, boolean isActive) throws AppException {
        Position position = positionRepository.findByName(name);
        if (position == null) {
            throw new AppException("POSITION_NOT_FOUND", "Position with given name does not exists");
        }
        position.setActive(isActive);
        return positionRepository.save(position).isActive();
    }

    @Override
    public void deletePosition(String name) throws AppException {
        Position position = positionRepository.findByName(name);
        if (position == null) {
            throw new AppException("POSITION_NOT_FOUND", "Position with given name does not exists");
        }
        positionRepository.deleteById(position.getId());
    }
}
