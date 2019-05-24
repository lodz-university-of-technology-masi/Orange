package pl.masi.services.implementations;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.masi.entities.Position;
import pl.masi.entities.Test;
import pl.masi.exceptions.AppException;
import pl.masi.repositories.PositionRepository;
import pl.masi.repositories.TestRepository;
import pl.masi.services.interfaces.IPositionService;

import java.util.Comparator;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class PositionService implements IPositionService {

    private final PositionRepository positionRepository;
    private final TestRepository testRepository;

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
        List<Test> testsToUpdate = testRepository.findByPositionName(name);
        if (testsToUpdate.size() > 0) {
            testsToUpdate.forEach(t -> { t.setPosition(null); testRepository.save(t);} );
        }
        positionRepository.deleteByName(position.getName());
    }
}
